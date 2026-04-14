import mongoose from "mongoose";
import { AppointmentStatus } from "../enum/queue.enum.js";

const AppointmentSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    timeSlot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },

    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
    },

    purpose: {
      type: String,
      maxlength: 500,
      default: null,
    },

    remarks: {
      type: String,
      maxlength: 500,
      default: null,
    },

    completedAt: {
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

AppointmentSchema.index({ serviceId: 1, date: 1 });
AppointmentSchema.index({ userId: 1, status: 1 });
AppointmentSchema.index({ staffId: 1, date: 1 });

export const AppointmentModel = mongoose.model(
  "Appointment",
  AppointmentSchema,
);
