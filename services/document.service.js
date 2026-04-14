import imagekit from "../config/imagekit.js";
import { DocumentStatus } from "../enum/document.enum.js";
import { DOCUMENT_PERMISSIONS } from "../constants/permission.js";
import { DocumentModel } from "../models/document.model.js";
import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { UserRole } from "../enum/user.enum.js";
import { canUser } from "../utils/rbac.util.js";
import logger from "../utils/logger.js";

const docLogger = logger.namespaceLogger("DOCUMENT");

export const getImageKitAuth = () => {
  return imagekit.getAuthenticationParameters();
};

export const uploadDocument = async (payload, user) => {
  if (!canUser(user, DOCUMENT_PERMISSIONS.DOCUMENT_UPLOAD)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const doc = await DocumentModel.create({
    name: payload.name,
    type: payload.type,
    uploadedBy: user._id,
    instituteId: user.instituteId,
    serviceRequestId: payload.serviceRequestId || null,
    fileUrl: payload.fileUrl,
    fileId: payload.fileId,
    mimeType: payload.mimeType || null,
    fileSize: payload.fileSize || null,
  });

  // If linked to a service request, add to its documents array
  if (payload.serviceRequestId) {
    await ServiceRequestModel.findByIdAndUpdate(payload.serviceRequestId, {
      $push: { documents: doc._id },
    });
  }

  docLogger.info(`Document uploaded: ${doc._id} by user ${user._id}`);
  return doc;
};

export const getDocument = async (id, user) => {
  const doc = await DocumentModel.findById(id)
    .populate("uploadedBy", "fullName email")
    .populate("verifiedBy", "fullName email");

  if (!doc) {
    throw Object.assign(new Error("Document not found"), { statusCode: 404 });
  }

  // Students can only view their own
  if (
    user.role === UserRole.STUDENT &&
    String(doc.uploadedBy._id || doc.uploadedBy) !== String(user._id)
  ) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  return doc;
};

export const listDocuments = async (query, user) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { instituteId: user.instituteId };

  if (user.role === UserRole.STUDENT) {
    filter.uploadedBy = user._id;
  }

  if (query.serviceRequestId) filter.serviceRequestId = query.serviceRequestId;
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    DocumentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("uploadedBy", "fullName email"),
    DocumentModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const verifyDocument = async (id, action, user, rejectionReason) => {
  if (!canUser(user, DOCUMENT_PERMISSIONS.DOCUMENT_VERIFY)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw Object.assign(new Error("Document not found"), { statusCode: 404 });
  }

  if (action === "verify") {
    doc.status = DocumentStatus.VERIFIED;
    doc.verifiedBy = user._id;
    doc.verifiedAt = new Date();
  } else if (action === "reject") {
    doc.status = DocumentStatus.REJECTED;
    doc.verifiedBy = user._id;
    doc.verifiedAt = new Date();
    doc.rejectionReason = rejectionReason || "No reason provided";
  } else {
    throw Object.assign(new Error("Invalid action"), { statusCode: 400 });
  }

  await doc.save();
  docLogger.info(`Document ${id} ${action}ed by ${user._id}`);
  return doc;
};

export const deleteDocument = async (id, user) => {
  if (!canUser(user, DOCUMENT_PERMISSIONS.DOCUMENT_DELETE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw Object.assign(new Error("Document not found"), { statusCode: 404 });
  }

  // Delete from ImageKit
  try {
    await imagekit.deleteFile(doc.fileId);
  } catch (err) {
    docLogger.warn(`Failed to delete file from ImageKit: ${doc.fileId}`);
  }

  // Remove from service request if linked
  if (doc.serviceRequestId) {
    await ServiceRequestModel.findByIdAndUpdate(doc.serviceRequestId, {
      $pull: { documents: doc._id },
    });
  }

  await DocumentModel.deleteOne({ _id: id });
  docLogger.info(`Document deleted: ${id}`);
  return true;
};
