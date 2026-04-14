import mongoose from "mongoose";
import redisClient from "../config/redis.js";
import { SERVICE_PERMISSIONS } from "../constants/permission.js";
import { ServiceStatus, ServiceVisibility } from "../enum/service.enum.js";
import { UserStatus } from "../enum/user.enum.js";
import { ServiceModel } from "../models/service.model.js";
import { CollectionService } from "../utils/collection.service.js";
import { canUser } from "../utils/rbac.util.js";
import fs from "fs";
const CACHE_TTL = 60 * 60 * 24;

const CACHE_KEY = {
  SERVICE_LIST: "service:list",
};

export const createService = async (payload, user) => {
  if (!canUser(user, SERVICE_PERMISSIONS.SERVICE_CREATE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }
  console.log("Creating service with payload:", payload, "by user:", user._id);
  const service = await ServiceModel.create({
    ...payload,
    instituteId: user.instituteId,
    createdBy: user._id,
  });
  console.log("1.Created service:", service);
  await redisClient
    .keys(`${CACHE_KEY.SERVICE_LIST}:${user.instituteId}:*`)
    .then((keys) => keys.length && redisClient.del(keys));

  return service;
};

export const updateService = async (serviceId, payload, user) => {
  const service = await ServiceModel.findById(serviceId);

  if (!service) {
    throw Object.assign(new Error("Service not found"), { statusCode: 404 });
  }

  const allowed =
    canUser(user, SERVICE_PERMISSIONS.SERVICE_UPDATE, service) ||
    canUser(user, SERVICE_PERMISSIONS.SERVICE_UPDATE_OWN, service);

  if (!allowed) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const updated = await ServiceModel.findByIdAndUpdate(serviceId, payload, {
    new: true,
    runValidators: true,
  });

  await redisClient
    .keys(`${CACHE_KEY.SERVICE_LIST}:${user.instituteId}:*`)
    .then((keys) => keys.length && redisClient.del(keys));

  return updated;
};

export const deleteService = async (serviceId, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const service = await ServiceModel.findById(serviceId).session(session);

    if (!service) {
      throw Object.assign(new Error("Service not found"), { statusCode: 404 });
    }

    if (!canUser(user, SERVICE_PERMISSIONS.SERVICE_DELETE, service)) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    if (service.status === ServiceStatus.ACTIVE) {
      throw Object.assign(new Error("Deactivate service before deleting"), {
        statusCode: 400,
      });
    }

    await ServiceModel.deleteOne({ _id: serviceId }).session(session);

    await session.commitTransaction();
    session.endSession();

    await redisClient
      .keys(`${CACHE_KEY.SERVICE_LIST}:${user.instituteId}:*`)
      .then((keys) => keys.length && redisClient.del(keys));

    return true;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getServiceById = async (id, user) => {
  const service = await ServiceModel.findOne({
    _id: id,
    instituteId: user.instituteId,
  })
    .populate("createdBy", "fullName email role")
    .populate({
      path: "instituteId",
      model: "Institute",
    });

  if (!service) {
    throw Object.assign(new Error("Service not found"), { statusCode: 404 });
  }

  if (user.role === UserStatus.STUDENT) {
    if (
      service.status !== ServiceStatus.ACTIVE ||
      service.visibility !== ServiceVisibility.PUBLIC
    ) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }
  }

  return service;
};

export const listServices = async (collectionQuery = {}, user) => {
  const baseFilter = {
    instituteId: user.instituteId,
  };

  if (user.role === UserStatus.STUDENT) {
    baseFilter.status = ServiceStatus.ACTIVE;
    baseFilter.visibility = ServiceVisibility.PUBLIC;
  }

  if (user.role === UserStatus.STAFF) {
    baseFilter.createdBy = user._id;
  }

  const mongoFilter = {
    ...baseFilter,
    ...CollectionService.buildQuery(collectionQuery?.filter),
  };

  const sort = CollectionService.buildSort(collectionQuery?.sort);
  const select = CollectionService.buildSelect(collectionQuery?.select);

  const { skip, limit } = CollectionService.getPagination(
    collectionQuery?.page,
    collectionQuery?.limit,
  );

  const page = collectionQuery?.page || 1;

  const cacheKey = `${CACHE_KEY.SERVICE_LIST}:${user.instituteId}:${user.role}:${page}:${limit}:${JSON.stringify(collectionQuery?.filter || {})}:${JSON.stringify(collectionQuery?.sort || [])}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [items, total] = await Promise.all([
    ServiceModel.find(mongoFilter)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "fullName email role")
      .populate({
        path: "instituteId",
        model: "Institute",
      }),
    ServiceModel.countDocuments(mongoFilter),
  ]);

  const result = {
    items,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  await redisClient.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
};

export const getAllActiveServices = async (query = {}, user) => {
  const filter = {
    instituteId: user.instituteId,
    status: ServiceStatus.ACTIVE,
    visibility: ServiceVisibility.PUBLIC,
  };

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  const cacheKey = `service:active:simple:${user.instituteId}:${query.search || ""}`;

  const cached = await redisClient.get(cacheKey);
  console.log("Cache key:", cacheKey, "Cached value:", cached);
  if (cached) {
    return JSON.parse(cached);
  }

  const services = await ServiceModel.find(filter)
    .limit(100)
    .populate("createdBy", "fullName email role")
    .populate({
      path: "instituteId",
      model: "Institute",
      select: "name code",
    });
  console.log("Fetched active services from DB:", services);
  await redisClient.set(cacheKey, JSON.stringify(services), "EX", CACHE_TTL);

  return services;
};
