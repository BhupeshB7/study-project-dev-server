import { emailProcessor } from "../controllers/email.controller.js";
import logger from "../utils/logger.js";
import { registerWorker } from "./queue.manager.js";

const queueLogger = logger.namespaceLogger("QUEUE");

export const EMAIL_QUEUE = "email";
export const NOTIFICATION_QUEUE = "notification";

const notificationProcessor = async (job) => {
  const { type, data } = job.data;
  queueLogger.info(`Processing notification job: ${type}`, {
    userId: data.userId,
  });
  // In-app notifications are created synchronously via the notification service.
  // This worker handles any async follow-up tasks (push notifications, SMS, etc.)
  // For the prototype, we just log.
  queueLogger.success(`Notification processed: ${type}`);
};

export const registerAllQueues = () => {
  queueLogger.info("Registering all queue workers...");
  registerWorker(EMAIL_QUEUE, emailProcessor);
  registerWorker(NOTIFICATION_QUEUE, notificationProcessor);
  queueLogger.success("All queue workers registered successfully");
};
