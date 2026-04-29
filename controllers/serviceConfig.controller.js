import * as serviceConfigService from "../services/serviceConfig.service.js";
import {
  createServiceConfigDto,
  updateServiceConfigDto,
} from "../dtos/serviceConfig.dto.js";

export const createServiceConfigController = async (req, res, next) => {
  try {
    const payload = await createServiceConfigDto.validate(req.body);
    const result = await serviceConfigService.createServiceConfig(
      payload,
      req.user,
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateServiceConfigController = async (req, res, next) => {
  try {
    const payload = await updateServiceConfigDto.validate(req.body);
    const result = await serviceConfigService.updateServiceConfig(
      req.params.serviceId,
      payload,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getServiceConfigController = async (req, res, next) => {
  try {
    const result = await serviceConfigService.getServiceConfig(
      req.params.serviceId,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteServiceConfigController = async (req, res, next) => {
  try {
    await serviceConfigService.deleteServiceConfig(
      req.params.serviceId,
      req.user,
    );
    res.status(200).json({ success: true, message: "Service config deleted" });
  } catch (err) {
    next(err);
  }
};

export const listServiceConfigsController = async (req, res, next) => {
  try {
    const result = await serviceConfigService.listServiceConfigs(
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
