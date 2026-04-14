// import Redis from "ioredis";
// import logger from "../utils/logger.js";

// const redisLogger = logger.namespaceLogger("REDIS");

// export const redisClient = new Redis({
//   host: process.env.REDIS_HOST,
//   port: Number(process.env.REDIS_PORT),
//   maxRetriesPerRequest: null,
//   enableReadyCheck: true,
//   lazyConnect: true,
// });

// redisClient.on("connecting", () => {
//   redisLogger.info("Connecting to Redis...");
// });

// redisClient.on("ready", () => {
//   redisLogger.success("Redis connection established");
// });

// redisClient.on("error", (err) => {
//   redisLogger.error("Redis client error", {
//     message: err.message,
//     stack: err.stack,
//   });
//   process.exit(1);
// });

// redisClient.on("close", () => {
//   redisLogger.warn("Redis connection closed");
// });

// export const connectRedis = async () => {
//   if (redisClient.status === "ready") {
//     redisLogger.debug("Redis already connected");
//     return;
//   }

//   try {
//     await redisClient.connect();
//   } catch (err) {
//     redisLogger.error("Failed to connect to Redis", {
//       message: err.message,
//       stack: err.stack,
//     });
//     process.exit(1);
//   }
// };

// export default redisClient;

import Redis from "ioredis";
import logger from "../utils/logger.js";

const wsLogger = logger.namespaceLogger("WEBSOCKET");

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  // No TLS block at all unless your provider explicitly requires it
});

redisClient.on("connect", () => wsLogger.info("Redis connecting..."));
redisClient.on("ready", () => wsLogger.success("Redis ready"));
redisClient.on("error", (err) =>
  wsLogger.error("Redis error", { message: err.message }),
);
redisClient.on("close", () => wsLogger.warn("Redis connection closed"));

export default redisClient;
