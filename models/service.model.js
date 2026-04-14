import mongoose, { Types } from "mongoose";
import { ServiceStatus, ServiceVisibility } from "../enum/service.enum.js";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    instituteId: {
      type: Types.ObjectId,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500,
    },
    visibility: {
      type: String,
      enum: Object.values(ServiceVisibility),
      default: ServiceVisibility.PUBLIC,
    },

    status: {
      type: String,
      enum: Object.values(ServiceStatus),
      default: ServiceStatus.ACTIVE,
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

ServiceSchema.index({ name: 1, institueId: 1 }, { unique: true });
ServiceSchema.index({ name: 1 });

export const ServiceModel = mongoose.model("Service", ServiceSchema);
