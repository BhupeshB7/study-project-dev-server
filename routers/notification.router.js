import { Router } from "express";
import {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
  getUnreadCountController,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const notificationRouter = Router();

notificationRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Notification module working" });
});

notificationRouter.use(authenticate);

notificationRouter.get("/", getNotificationsController);
notificationRouter.get("/unread-count", getUnreadCountController);
notificationRouter.patch("/:id/read", markAsReadController);
notificationRouter.patch("/read-all", markAllAsReadController);
notificationRouter.delete("/:id", deleteNotificationController);

export default notificationRouter;
