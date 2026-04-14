import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import config from "./config/constant.js";
import connectDB from "./config/db.js";
import swaggerSpec from "./docs/index.js";
import { setupWebSocket } from "./config/websocket.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import router from "./routers/index.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 5000;

const serverLogger = logger.namespaceLogger("SERVER");

await connectDB();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SECRET));

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("dev", {
      stream: {
        write: (message) => serverLogger.info(message.trim()),
      },
    }),
  );
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.use(globalErrorHandler);

// Create HTTP server and attach WebSocket
const server = createServer(app);
setupWebSocket(server);

server.listen(PORT, async () => {
  await import("./queue/queue.register.js");
  serverLogger.info(`Server running on http://localhost:${PORT}`);
  serverLogger.info(`WebSocket available on ws://localhost:${PORT}/ws`);
  serverLogger.info(`API docs at http://localhost:${PORT}/docs`);
});
