import mongoose from "mongoose";
import { CounterStatus } from "../enum/queue.enum.js";

const QueueCounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

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

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(CounterStatus),
      default: CounterStatus.CLOSED,
    },

    currentTicketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QueueTicket",
      default: null,
    },

    totalServed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

QueueCounterSchema.index({ serviceId: 1, instituteId: 1 });

export const QueueCounterModel = mongoose.model(
  "QueueCounter",
  QueueCounterSchema,
);
