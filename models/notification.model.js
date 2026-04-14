import mongoose from "mongoose";
import {
  NotificationType,
  NotificationCategory,
} from "../enum/notification.enum.js";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.INFO,
    },

    category: {
      type: String,
      enum: Object.values(NotificationCategory),
      default: NotificationCategory.SYSTEM,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    referenceModel: {
      type: String,
      enum: [
        "ServiceRequest",
        "QueueTicket",
        "Appointment",
        "Document",
        null,
      ],
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const NotificationModel = mongoose.model(
  "Notification",
  NotificationSchema,
);
