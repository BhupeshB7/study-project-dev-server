import * as serviceRequestService from "../services/serviceRequest.service.js";
import {
  submitServiceRequestDto,
  reviewServiceRequestDto,
  addRemarkDto,
} from "../dtos/serviceRequest.dto.js";

export const submitServiceRequestController = async (req, res, next) => {
  try {
    const payload = await submitServiceRequestDto.validate(req.body);
    const result = await serviceRequestService.submitServiceRequest(
      payload,
      req.user,
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getServiceRequestController = async (req, res, next) => {
  try {
    const result = await serviceRequestService.getServiceRequest(
      req.params.id,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listServiceRequestsController = async (req, res, next) => {
  try {
    const result = await serviceRequestService.listServiceRequests(
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

export const reviewServiceRequestController = async (req, res, next) => {
  try {
    const payload = await reviewServiceRequestDto.validate(req.body);
    const result = await serviceRequestService.reviewServiceRequest(
      req.params.id,
      payload.action,
      req.user,
      { remarks: payload.remarks },
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const cancelServiceRequestController = async (req, res, next) => {
  try {
    const result = await serviceRequestService.cancelServiceRequest(
      req.params.id,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const addRemarkController = async (req, res, next) => {
  try {
    const payload = await addRemarkDto.validate(req.body);
    const result = await serviceRequestService.addRemarkToRequest(
      req.params.id,
      req.user,
      payload.text,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
