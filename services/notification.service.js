import { NotificationModel } from "../models/notification.model.js";
import { NotificationType } from "../enum/notification.enum.js";
import logger from "../utils/logger.js";

const notifLogger = logger.namespaceLogger("NOTIFICATION");

export const createNotification = async (payload) => {
  const notification = await NotificationModel.create({
    userId: payload.userId,
    title: payload.title,
    message: payload.message,
    type: payload.type || NotificationType.INFO,
    category: payload.category,
    referenceId: payload.referenceId || null,
    referenceModel: payload.referenceModel || null,
  });

  notifLogger.debug(`Notification created for user ${payload.userId}`);
  return notification;
};

export const getUserNotifications = async (userId, query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { userId };
  if (query.isRead !== undefined) filter.isRead = query.isRead === "true";
  if (query.category) filter.category = query.category;

  const [items, total, unreadCount] = await Promise.all([
    NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    NotificationModel.countDocuments(filter),
    NotificationModel.countDocuments({ userId, isRead: false }),
  ]);

  return {
    items,
    unreadCount,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true, readAt: new Date() },
    { new: true },
  );

  if (!notification) {
    throw Object.assign(new Error("Notification not found"), {
      statusCode: 404,
    });
  }

  return notification;
};

export const markAllAsRead = async (userId) => {
  const result = await NotificationModel.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() },
  );

  notifLogger.debug(`Marked ${result.modifiedCount} notifications as read for ${userId}`);
  return { modifiedCount: result.modifiedCount };
};

export const deleteNotification = async (notificationId, userId) => {
  const notification = await NotificationModel.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw Object.assign(new Error("Notification not found"), {
      statusCode: 404,
    });
  }

  return true;
};

export const getUnreadCount = async (userId) => {
  return NotificationModel.countDocuments({ userId, isRead: false });
};
