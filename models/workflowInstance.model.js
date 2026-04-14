import mongoose from "mongoose";
import { WorkflowStepStatus } from "../enum/workflow.enum.js";

const StepInstanceSchema = new mongoose.Schema({
  stepOrder: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(WorkflowStepStatus),
    default: WorkflowStepStatus.PENDING,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  completedAt: { type: Date, default: null },
  remarks: { type: String, default: null },
});

const WorkflowInstanceSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkflowTemplate",
      required: true,
    },

    serviceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    currentStepOrder: {
      type: Number,
      default: 1,
    },

    steps: [StepInstanceSchema],

    isComplete: {
      type: Boolean,
      default: false,
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

WorkflowInstanceSchema.index({ serviceRequestId: 1 });
WorkflowInstanceSchema.index({ templateId: 1 });

export const WorkflowInstanceModel = mongoose.model(
  "WorkflowInstance",
  WorkflowInstanceSchema,
);
