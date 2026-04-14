import * as chatService from "../services/chat.service.js";
import { askQuestionDto, createFaqDto, updateFaqDto } from "../dtos/chat.dto.js";

export const askQuestionController = async (req, res, next) => {
  try {
    const payload = await askQuestionDto.validate(req.body);
    const result = await chatService.askQuestion(payload.question, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listFaqCategoriesController = async (req, res, next) => {
  try {
    const result = await chatService.listFaqCategories(req.user.instituteId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listFaqsByCategoryController = async (req, res, next) => {
  try {
    const result = await chatService.listFaqsByCategory(
      req.params.category,
      req.user.instituteId,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// --- FAQ Management ---

export const createFaqController = async (req, res, next) => {
  try {
    const payload = await createFaqDto.validate(req.body);
    const result = await chatService.createFaq(payload, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateFaqController = async (req, res, next) => {
  try {
    const payload = await updateFaqDto.validate(req.body);
    const result = await chatService.updateFaq(req.params.id, payload, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteFaqController = async (req, res, next) => {
  try {
    await chatService.deleteFaq(req.params.id, req.user);
    res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    next(err);
  }
};

export const listFaqsController = async (req, res, next) => {
  try {
    const result = await chatService.listFaqs(req.query, req.user);
    res.status(200).json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};
