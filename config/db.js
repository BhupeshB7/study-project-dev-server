import mongoose from "mongoose";
import config from "./constant.js";
import logger from "../utils/logger.js";

let isConnected = false;

const mongoLog = logger.namespaceLogger("MONGODB");
const connectDB = async () => {
  if (isConnected) return;

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(config.MONGODB_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = true;
    mongoLog.success("MongoDB connected");
  } catch (error) {
    mongoLog.error("MongoDB connection failed", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  mongoLog.info("MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  mongoLog.error("MongoDB connection error", {
    message: err.message,
  });
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  mongoLog.warn("MongoDB disconnected");
});

const gracefulShutdown = async (signal) => {
  try {
    mongoLog.warn(`Shutting down MongoDB (${signal})`);
    await mongoose.connection.close();
    mongoLog.success("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    mongoLog.error("Error during MongoDB shutdown", {
      message: error.message,
    });
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

process.on("uncaughtException", (error) => {
  mongoLog.error("Uncaught Exception", {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  mongoLog.error("Unhandled Rejection", {
    message: reason?.message || reason,
    stack: reason?.stack,
    raw: reason,
  });
});


export default connectDB;
