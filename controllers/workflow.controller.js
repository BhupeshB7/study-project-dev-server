import * as workflowService from "../services/workflow.service.js";
import {
  createWorkflowTemplateDto,
  updateWorkflowTemplateDto,
  advanceWorkflowDto,
  rejectWorkflowDto,
} from "../dtos/workflow.dto.js";

// --- Template CRUD ---

export const createWorkflowTemplateController = async (req, res, next) => {
  try {
    const payload = await createWorkflowTemplateDto.validate(req.body);
    const result = await workflowService.createWorkflowTemplate(
      payload,
      req.user,
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getWorkflowTemplateController = async (req, res, next) => {
  try {
    const result = await workflowService.getWorkflowTemplate(
      req.params.id,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listWorkflowTemplatesController = async (req, res, next) => {
  try {
    const result = await workflowService.listWorkflowTemplates(
      req.query,
      req.user,
    );
    res.status(200).json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

export const updateWorkflowTemplateController = async (req, res, next) => {
  try {
    const payload = await updateWorkflowTemplateDto.validate(req.body);
    const result = await workflowService.updateWorkflowTemplate(
      req.params.id,
      payload,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkflowTemplateController = async (req, res, next) => {
  try {
    await workflowService.deleteWorkflowTemplate(req.params.id, req.user);
    res
      .status(200)
      .json({ success: true, message: "Workflow template deleted" });
  } catch (err) {
    next(err);
  }
};

// --- Workflow Instance (Engine) ---

export const getWorkflowInstanceController = async (req, res, next) => {
  try {
    const result = await workflowService.getWorkflowInstance(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const advanceWorkflowController = async (req, res, next) => {
  try {
    const payload = await advanceWorkflowDto.validate(req.body);
    const result = await workflowService.advanceWorkflow(
      req.params.id,
      req.user,
      payload.remarks,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const rejectWorkflowController = async (req, res, next) => {
  try {
    const payload = await rejectWorkflowDto.validate(req.body);
    const result = await workflowService.rejectWorkflowStep(
      req.params.id,
      req.user,
      payload.reason,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
