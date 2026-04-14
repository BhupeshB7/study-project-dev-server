import mongoose from "mongoose";
import { WorkflowStepStatus } from "../enum/workflow.enum.js";
import { WorkflowStatus } from "../enum/workflow.enum.js";
import { ServiceRequestStatus } from "../enum/serviceRequest.enum.js";
import { WorkflowTemplateModel } from "../models/workflowTemplate.model.js";
import { WorkflowInstanceModel } from "../models/workflowInstance.model.js";
import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { WORKFLOW_PERMISSIONS } from "../constants/permission.js";
import { canUser } from "../utils/rbac.util.js";
import logger from "../utils/logger.js";

const wfLogger = logger.namespaceLogger("WORKFLOW");

// --- Workflow Template CRUD ---

export const createWorkflowTemplate = async (payload, user) => {
  if (!canUser(user, WORKFLOW_PERMISSIONS.WORKFLOW_CREATE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const sorted = (payload.steps || [])
    .slice()
    .sort((a, b) => a.order - b.order);

  const template = await WorkflowTemplateModel.create({
    ...payload,
    steps: sorted,
    instituteId: user.instituteId,
    createdBy: user._id,
  });

  wfLogger.info(`Workflow template created: ${template._id}`);
  return template;
};

export const getWorkflowTemplate = async (id, user) => {
  const template = await WorkflowTemplateModel.findOne({
    _id: id,
    instituteId: user.instituteId,
  }).populate("createdBy", "fullName email");

  if (!template) {
    throw Object.assign(new Error("Workflow template not found"), {
      statusCode: 404,
    });
  }
  return template;
};

export const listWorkflowTemplates = async (query, user) => {
  if (!canUser(user, WORKFLOW_PERMISSIONS.WORKFLOW_VIEW)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { instituteId: user.instituteId };
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    WorkflowTemplateModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "fullName email")
      .populate("serviceId", "name"),
    WorkflowTemplateModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const updateWorkflowTemplate = async (id, payload, user) => {
  if (!canUser(user, WORKFLOW_PERMISSIONS.WORKFLOW_UPDATE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const template = await WorkflowTemplateModel.findOneAndUpdate(
    { _id: id, instituteId: user.instituteId },
    payload,
    { new: true, runValidators: true },
  );

  if (!template) {
    throw Object.assign(new Error("Workflow template not found"), {
      statusCode: 404,
    });
  }
  return template;
};

export const deleteWorkflowTemplate = async (id, user) => {
  if (!canUser(user, WORKFLOW_PERMISSIONS.WORKFLOW_DELETE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const template = await WorkflowTemplateModel.findOneAndDelete({
    _id: id,
    instituteId: user.instituteId,
  });

  if (!template) {
    throw Object.assign(new Error("Workflow template not found"), {
      statusCode: 404,
    });
  }
  return true;
};

// --- Workflow Instance (Engine) ---

export const startWorkflow = async (serviceRequestId, templateId) => {
  const template = await WorkflowTemplateModel.findById(templateId);
  if (!template || template.status !== WorkflowStatus.ACTIVE) {
    throw Object.assign(new Error("Active workflow template not found"), {
      statusCode: 404,
    });
  }

  const stepInstances = template.steps.map((step) => ({
    stepOrder: step.order,
    name: step.name,
    type: step.type,
    status: WorkflowStepStatus.PENDING,
  }));

  if (stepInstances.length > 0) {
    stepInstances[0].status = WorkflowStepStatus.IN_PROGRESS;
  }

  const instance = await WorkflowInstanceModel.create({
    templateId,
    serviceRequestId,
    currentStepOrder: 1,
    steps: stepInstances,
  });

  await ServiceRequestModel.findByIdAndUpdate(serviceRequestId, {
    workflowInstanceId: instance._id,
    status: ServiceRequestStatus.UNDER_REVIEW,
  });

  wfLogger.info(
    `Workflow started: instance=${instance._id} request=${serviceRequestId}`,
  );
  return instance;
};

export const advanceWorkflow = async (instanceId, user, remarks = null) => {
  const instance = await WorkflowInstanceModel.findById(instanceId);
  if (!instance) {
    throw Object.assign(new Error("Workflow instance not found"), {
      statusCode: 404,
    });
  }

  if (instance.isComplete) {
    throw Object.assign(new Error("Workflow already complete"), {
      statusCode: 400,
    });
  }

  const currentStep = instance.steps.find(
    (s) => s.stepOrder === instance.currentStepOrder,
  );

  if (!currentStep) {
    throw Object.assign(new Error("Current step not found"), {
      statusCode: 500,
    });
  }

  // Mark current step as completed
  currentStep.status = WorkflowStepStatus.COMPLETED;
  currentStep.completedBy = user._id;
  currentStep.completedAt = new Date();
  if (remarks) currentStep.remarks = remarks;

  // Find next step
  const nextStep = instance.steps.find(
    (s) => s.stepOrder === instance.currentStepOrder + 1,
  );

  if (nextStep) {
    nextStep.status = WorkflowStepStatus.IN_PROGRESS;
    instance.currentStepOrder += 1;
  } else {
    // Workflow complete
    instance.isComplete = true;
    instance.completedAt = new Date();

    await ServiceRequestModel.findByIdAndUpdate(
      instance.serviceRequestId,
      {
        status: ServiceRequestStatus.COMPLETED,
        resolvedAt: new Date(),
      },
    );
  }

  await instance.save();

  wfLogger.info(
    `Workflow advanced: instance=${instanceId} step=${instance.currentStepOrder}`,
  );
  return instance;
};

export const rejectWorkflowStep = async (instanceId, user, reason) => {
  const instance = await WorkflowInstanceModel.findById(instanceId);
  if (!instance) {
    throw Object.assign(new Error("Workflow instance not found"), {
      statusCode: 404,
    });
  }

  const currentStep = instance.steps.find(
    (s) => s.stepOrder === instance.currentStepOrder,
  );

  if (!currentStep) {
    throw Object.assign(new Error("Current step not found"), {
      statusCode: 500,
    });
  }

  currentStep.status = WorkflowStepStatus.FAILED;
  currentStep.completedBy = user._id;
  currentStep.completedAt = new Date();
  currentStep.remarks = reason;

  instance.isComplete = true;
  instance.completedAt = new Date();

  await instance.save();

  await ServiceRequestModel.findByIdAndUpdate(instance.serviceRequestId, {
    status: ServiceRequestStatus.REJECTED,
    resolvedAt: new Date(),
  });

  wfLogger.info(`Workflow rejected: instance=${instanceId}`);
  return instance;
};

export const getWorkflowInstance = async (instanceId) => {
  const instance = await WorkflowInstanceModel.findById(instanceId)
    .populate("templateId", "name description")
    .populate("steps.assignedTo", "fullName email")
    .populate("steps.completedBy", "fullName email");

  if (!instance) {
    throw Object.assign(new Error("Workflow instance not found"), {
      statusCode: 404,
    });
  }
  return instance;
};
