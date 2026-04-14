import { createServiceDto, updateServiceDto } from "../dtos/service.dto.js";
import * as serviceService from "../services/service.service.js";

export const createServiceController = async (req, res, next) => {
  try {
    const payload = await createServiceDto.validate(req.body);
    const result = await serviceService.createService(payload, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateServiceController = async (req, res, next) => {
  try {
    const payload = await updateServiceDto.validate(req.body);
    const result = await serviceService.updateService(
      req.params.id,
      payload,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteServiceController = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};

export const getServiceController = async (req, res, next) => {
  try {
    const result = await serviceService.getServiceById(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listServicesController = async (req, res, next) => {
  try {
    const result = await serviceService.listServices(req.body, req.user);
    res.status(200).json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllActiveServicesController = async (req, res, next) => {
  try {
    const result = await serviceService.getAllActiveServices(
      req.body,
      req.user,
    ); 
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
