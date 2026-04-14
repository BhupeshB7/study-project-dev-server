import * as documentService from "../services/document.service.js";
import { uploadDocumentDto, verifyDocumentDto } from "../dtos/document.dto.js";

export const getImageKitAuthController = async (req, res, next) => {
  try {
    const result = documentService.getImageKitAuth();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const uploadDocumentController = async (req, res, next) => {
  try {
    const payload = await uploadDocumentDto.validate(req.body);
    const result = await documentService.uploadDocument(payload, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getDocumentController = async (req, res, next) => {
  try {
    const result = await documentService.getDocument(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listDocumentsController = async (req, res, next) => {
  try {
    const result = await documentService.listDocuments(req.query, req.user);
    res.status(200).json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyDocumentController = async (req, res, next) => {
  try {
    const payload = await verifyDocumentDto.validate(req.body);
    const result = await documentService.verifyDocument(
      req.params.id,
      payload.action,
      req.user,
      payload.rejectionReason,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteDocumentController = async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Document deleted" });
  } catch (err) {
    next(err);
  }
};
