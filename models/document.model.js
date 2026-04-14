import mongoose from "mongoose";
import { DocumentType, DocumentStatus } from "../enum/document.enum.js";

const DocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    type: {
      type: String,
      enum: Object.values(DocumentType),
      default: DocumentType.OTHER,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    serviceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      default: null,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileId: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      default: null,
    },

    fileSize: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.PENDING,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ serviceRequestId: 1 });
DocumentSchema.index({ instituteId: 1 });

export const DocumentModel = mongoose.model("Document", DocumentSchema);
