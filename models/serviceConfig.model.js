import mongoose from "mongoose";
import {
  DocumentRequirementStatus,
  SlotDayOfWeek,
} from "../enum/serviceConfig.enum.js";

const DocumentRequirementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  status: {
    type: String,
    enum: Object.values(DocumentRequirementStatus),
    default: DocumentRequirementStatus.REQUIRED,
  },
  description: {
    type: String,
    maxlength: 300,
    default: null,
  },
});

const SlotConfigSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: Object.values(SlotDayOfWeek),
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  slotDurationMinutes: {
    type: Number,
    default: 30,
    min: 5,
  },
  maxConcurrent: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const ServiceConfigSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      unique: true,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    requiredDocuments: {
      type: [DocumentRequirementSchema],
      default: [],
    },

    slots: {
      type: [SlotConfigSchema],
      default: [],
    },

    maxActiveRequestsPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },

    allowAppointments: {
      type: Boolean,
      default: false,
    },

    allowQueue: {
      type: Boolean,
      default: true,
    },

    eligibleRoles: {
      type: [String],
      default: ["student"],
    },

    processingDays: {
      type: Number,
      default: null,
    },

    notes: {
      type: String,
      maxlength: 1000,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

ServiceConfigSchema.index({ serviceId: 1 });
ServiceConfigSchema.index({ instituteId: 1 });

export const ServiceConfigModel = mongoose.model(
  "ServiceConfig",
  ServiceConfigSchema,
);
