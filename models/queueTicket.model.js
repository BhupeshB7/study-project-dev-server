import mongoose from "mongoose";
import { QueueTicketStatus } from "../enum/queue.enum.js";

const QueueTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    counterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QueueCounter",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(QueueTicketStatus),
      default: QueueTicketStatus.WAITING,
    },

    position: {
      type: Number,
      required: true,
    },

    calledAt: {
      type: Date,
      default: null,
    },

    servedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    estimatedWaitMinutes: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

QueueTicketSchema.index({ serviceId: 1, status: 1 });
QueueTicketSchema.index({ userId: 1, status: 1 });
QueueTicketSchema.index({ instituteId: 1, createdAt: -1 });
QueueTicketSchema.index({ serviceId: 1, instituteId: 1, status: 1 });
// Auto-generate ticket number
QueueTicketSchema.pre("validate", async function () {
  if (this.isNew && !this.ticketNumber) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const count = await mongoose.model("QueueTicket").countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });
    this.ticketNumber = `Q${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
});

export const QueueTicketModel = mongoose.model(
  "QueueTicket",
  QueueTicketSchema,
);
