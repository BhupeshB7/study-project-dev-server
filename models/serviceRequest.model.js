import mongoose from "mongoose";
import {
  ServiceRequestStatus,
  ServiceRequestPriority,
} from "../enum/serviceRequest.enum.js";

const ServiceRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ServiceRequestStatus),
      default: ServiceRequestStatus.SUBMITTED,
    },

    priority: {
      type: String,
      enum: Object.values(ServiceRequestPriority),
      default: ServiceRequestPriority.NORMAL,
    },

    description: {
      type: String,
      maxlength: 2000,
      default: null,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    workflowInstanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkflowInstance",
      default: null,
    },

    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    remarks: [
      {
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    resolvedAt: {
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

ServiceRequestSchema.index({ applicantId: 1, status: 1 });
ServiceRequestSchema.index({ instituteId: 1, status: 1 });
ServiceRequestSchema.index({ assignedTo: 1, status: 1 });

// Auto-generate request number
ServiceRequestSchema.pre("validate", async function () {
  if (this.isNew && !this.requestNumber) {
    const count = await mongoose.model("ServiceRequest").countDocuments();
    const padded = String(count + 1).padStart(6, "0");
    this.requestNumber = `SR-${padded}`;
  }
});

export const ServiceRequestModel = mongoose.model(
  "ServiceRequest",
  ServiceRequestSchema,
);
