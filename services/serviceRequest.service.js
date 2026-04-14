import mongoose from "mongoose";
import {
  ServiceRequestStatus,
  ServiceRequestPriority,
} from "../enum/serviceRequest.enum.js";
import { WorkflowStatus } from "../enum/workflow.enum.js";
import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { ServiceModel } from "../models/service.model.js";
import { WorkflowTemplateModel } from "../models/workflowTemplate.model.js";
import { REQUEST_PERMISSIONS } from "../constants/permission.js";
import { UserRole } from "../enum/user.enum.js";
import { canUser } from "../utils/rbac.util.js";
import { CollectionService } from "../utils/collection.service.js";
import { startWorkflow } from "./workflow.service.js";
import { createNotification } from "./notification.service.js";
import { NotificationCategory } from "../enum/notification.enum.js";
import logger from "../utils/logger.js";

const reqLogger = logger.namespaceLogger("SERVICE_REQUEST");

export const submitServiceRequest = async (payload, user) => {
  if (!canUser(user, REQUEST_PERMISSIONS.REQUEST_CREATE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const service = await ServiceModel.findById(payload.serviceId);
  if (!service) {
    throw Object.assign(new Error("Service not found"), { statusCode: 404 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await ServiceRequestModel.create(
      [
        {
          serviceId: payload.serviceId,
          applicantId: user._id,
          instituteId: user.instituteId,
          description: payload.description || null,
          priority: payload.priority || ServiceRequestPriority.NORMAL,
          status: ServiceRequestStatus.SUBMITTED,
        },
      ],
      { session },
    );

    const serviceRequest = request[0];

    // Auto-start workflow if template exists for this service
    const template = await WorkflowTemplateModel.findOne({
      serviceId: payload.serviceId,
      instituteId: user.instituteId,
      status: WorkflowStatus.ACTIVE,
    });

    if (template) {
      const wfInstance = await startWorkflow(serviceRequest._id, template._id);
      serviceRequest.workflowInstanceId = wfInstance._id;
      serviceRequest.status = ServiceRequestStatus.UNDER_REVIEW;
      await serviceRequest.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    reqLogger.info(`Service request submitted: ${serviceRequest.requestNumber}`);

    // Fire-and-forget notification
    createNotification({
      userId: user._id,
      title: "Service Request Submitted",
      message: `Your request ${serviceRequest.requestNumber} has been submitted.`,
      category: NotificationCategory.SERVICE_REQUEST,
      referenceId: serviceRequest._id,
      referenceModel: "ServiceRequest",
    }).catch(() => {});

    return serviceRequest;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getServiceRequest = async (id, user) => {
  const request = await ServiceRequestModel.findById(id)
    .populate("serviceId", "name description")
    .populate("applicantId", "fullName email")
    .populate("assignedTo", "fullName email")
    .populate("documents")
    .populate("remarks.by", "fullName email role");

  if (!request) {
    throw Object.assign(new Error("Service request not found"), {
      statusCode: 404,
    });
  }

  // Students can only view their own
  if (
    user.role === UserRole.STUDENT &&
    String(request.applicantId._id || request.applicantId) !== String(user._id)
  ) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  return request;
};

export const listServiceRequests = async (query, user) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { instituteId: user.instituteId };

  // Students see only their own requests
  if (user.role === UserRole.STUDENT) {
    filter.applicantId = user._id;
  }

  // Staff see requests assigned to them or for services they manage
  if (user.role === UserRole.STAFF) {
    filter.$or = [
      { assignedTo: user._id },
      { assignedTo: null },
    ];
  }

  if (query.status) filter.status = query.status;
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.priority) filter.priority = query.priority;

  const [items, total] = await Promise.all([
    ServiceRequestModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("serviceId", "name")
      .populate("applicantId", "fullName email")
      .populate("assignedTo", "fullName email"),
    ServiceRequestModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const reviewServiceRequest = async (id, action, user, payload = {}) => {
  if (!canUser(user, REQUEST_PERMISSIONS.REQUEST_REVIEW)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const request = await ServiceRequestModel.findById(id);
  if (!request) {
    throw Object.assign(new Error("Service request not found"), {
      statusCode: 404,
    });
  }

  const validActions = {
    approve: ServiceRequestStatus.APPROVED,
    reject: ServiceRequestStatus.REJECTED,
    request_docs: ServiceRequestStatus.AWAITING_DOCUMENTS,
    in_progress: ServiceRequestStatus.IN_PROGRESS,
    complete: ServiceRequestStatus.COMPLETED,
  };

  if (!validActions[action]) {
    throw Object.assign(new Error(`Invalid action: ${action}`), {
      statusCode: 400,
    });
  }

  request.status = validActions[action];

  if (action === "approve" || action === "reject" || action === "complete") {
    request.resolvedAt = new Date();
  }

  if (!request.assignedTo) {
    request.assignedTo = user._id;
  }

  if (payload.remarks) {
    request.remarks.push({
      by: user._id,
      text: payload.remarks,
    });
  }

  await request.save();

  reqLogger.info(`Service request ${action}: ${request.requestNumber}`);

  // Notify applicant
  createNotification({
    userId: request.applicantId,
    title: `Request ${action.replace("_", " ")}`,
    message: `Your request ${request.requestNumber} has been ${action.replace("_", " ")}.`,
    category: NotificationCategory.SERVICE_REQUEST,
    referenceId: request._id,
    referenceModel: "ServiceRequest",
  }).catch(() => {});

  return request;
};

export const cancelServiceRequest = async (id, user) => {
  const request = await ServiceRequestModel.findById(id);
  if (!request) {
    throw Object.assign(new Error("Service request not found"), {
      statusCode: 404,
    });
  }

  if (String(request.applicantId) !== String(user._id)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const cancellableStatuses = [
    ServiceRequestStatus.DRAFT,
    ServiceRequestStatus.SUBMITTED,
    ServiceRequestStatus.UNDER_REVIEW,
  ];

  if (!cancellableStatuses.includes(request.status)) {
    throw Object.assign(new Error("Cannot cancel request in current state"), {
      statusCode: 400,
    });
  }

  request.status = ServiceRequestStatus.CANCELLED;
  request.resolvedAt = new Date();
  await request.save();

  reqLogger.info(`Service request cancelled: ${request.requestNumber}`);
  return request;
};

export const addRemarkToRequest = async (id, user, text) => {
  const request = await ServiceRequestModel.findById(id);
  if (!request) {
    throw Object.assign(new Error("Service request not found"), {
      statusCode: 404,
    });
  }

  request.remarks.push({ by: user._id, text });
  await request.save();
  return request;
};
