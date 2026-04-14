import { WebSocketServer } from "ws";
import redisClient from "./redis.js";
import logger from "../utils/logger.js";

const wsLogger = logger.namespaceLogger("WEBSOCKET");

let wss = null;
const clientsByUser = new Map();

export const setupWebSocket = (server) => {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");

    if (userId) {
      if (!clientsByUser.has(userId)) {
        clientsByUser.set(userId, new Set());
      }
      clientsByUser.get(userId).add(ws);
      wsLogger.info(`Client connected: userId=${userId}`);
    }

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleClientMessage(ws, data, userId);
      } catch {
        // Ignore invalid messages
      }
    });

    ws.on("close", () => {
      if (userId && clientsByUser.has(userId)) {
        clientsByUser.get(userId).delete(ws);
        if (clientsByUser.get(userId).size === 0) {
          clientsByUser.delete(userId);
        }
        wsLogger.info(`Client disconnected: userId=${userId}`);
      }
    });

    ws.on("error", (err) => {
      wsLogger.error("WebSocket error", { message: err.message });
    });

    // Send initial connection acknowledgment
    ws.send(
      JSON.stringify({
        type: "CONNECTION_ACK",
        message: "Connected to queue management system",
        timestamp: new Date().toISOString(),
      }),
    );
  });

  // Subscribe to Redis pub/sub for queue updates
  setupRedisSubscriber();

  wsLogger.success("WebSocket server initialized on /ws");
  return wss;
};

const handleClientMessage = (ws, data, userId) => {
  switch (data.type) {
    case "SUBSCRIBE_QUEUE":
      // Client wants to subscribe to queue updates for a specific service
      ws._subscribedQueues = ws._subscribedQueues || new Set();
      ws._subscribedQueues.add(data.serviceId);
      ws.send(
        JSON.stringify({
          type: "SUBSCRIBED",
          serviceId: data.serviceId,
        }),
      );
      break;

    case "UNSUBSCRIBE_QUEUE":
      if (ws._subscribedQueues) {
        ws._subscribedQueues.delete(data.serviceId);
      }
      break;

    case "PING":
      ws.send(JSON.stringify({ type: "PONG" }));
      break;

    default:
      break;
  }
};

const setupRedisSubscriber = async () => {
  // Create a separate Redis connection for subscribing
  const subscriber = redisClient.duplicate();

  subscriber.on("error", (err) => {
    wsLogger.error("Redis subscriber error", { message: err.message });
  });

  await subscriber.connect();

  subscriber.on("message", (channel, message) => {
    try {
      const data = JSON.parse(message);

      // Extract serviceId from channel (format: queue:<serviceId>)
      const serviceId = channel.split(":")[1];

      // Broadcast to all connected clients subscribed to this queue
      if (wss) {
        wss.clients.forEach((client) => {
          if (
            client.readyState === 1 &&
            client._subscribedQueues &&
            client._subscribedQueues.has(serviceId)
          ) {
            client.send(
              JSON.stringify({
                ...data,
                serviceId,
                timestamp: new Date().toISOString(),
              }),
            );
          }
        });
      }
    } catch {
      // Ignore parse errors
    }
  });

  // Subscribe to queue update channels using pattern
  subscriber.psubscribe("queue:*");
  wsLogger.info("Redis subscriber listening on queue:* channels");
};

// Send notification to a specific user
export const sendToUser = (userId, data) => {
  const clients = clientsByUser.get(String(userId));
  if (!clients) return;

  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(message);
    }
  });
};

// Broadcast to all connected clients
export const broadcast = (data) => {
  if (!wss) return;

  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};
