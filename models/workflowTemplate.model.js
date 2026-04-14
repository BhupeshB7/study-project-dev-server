import mongoose from "mongoose";
import {
  WorkflowStepType,
  WorkflowStatus,
} from "../enum/workflow.enum.js";

const WorkflowStepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  name: { type: String, required: true, maxlength: 100 },
  type: {
    type: String,
    enum: Object.values(WorkflowStepType),
    required: true,
  },
  description: { type: String, maxlength: 500, default: null },
  assignToRole: { type: String, default: null },
  isRequired: { type: Boolean, default: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const WorkflowTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
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

    description: {
      type: String,
      maxlength: 500,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(WorkflowStatus),
      default: WorkflowStatus.ACTIVE,
    },

    steps: [WorkflowStepSchema],

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

WorkflowTemplateSchema.index({ serviceId: 1 });
WorkflowTemplateSchema.index({ instituteId: 1 });

export const WorkflowTemplateModel = mongoose.model(
  "WorkflowTemplate",
  WorkflowTemplateSchema,
);
