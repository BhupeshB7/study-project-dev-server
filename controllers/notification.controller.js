import * as notificationService from "../services/notification.service.js";

export const getNotificationsController = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(
      req.user._id,
      req.query,
    );
    res.status(200).json({
      success: true,
      data: result.items,
      unreadCount: result.unreadCount,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

export const markAsReadController = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(
      req.params.id,
      req.user._id,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const markAllAsReadController = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteNotificationController = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCountController = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, data: { unreadCount: count } });
  } catch (err) {
    next(err);
  }
};
