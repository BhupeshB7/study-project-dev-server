import * as yup from "yup";
import { ServiceStatus, ServiceVisibility } from "../enum/service.enum.js";

export const createServiceDto = yup.object({
  name: yup.string().trim().min(2).max(150).required(),
  description: yup.string().trim().max(500).nullable(),
  visibility: yup
    .string()
    .oneOf(Object.values(ServiceVisibility))
    .default(ServiceVisibility.PUBLIC),
});

export const updateServiceDto = yup.object({
  name: yup.string().trim().min(2).max(150).optional(),
  description: yup.string().trim().max(500).nullable(),
  visibility: yup.string().oneOf(Object.values(ServiceVisibility)).optional(),
  status: yup.string().oneOf(Object.values(ServiceStatus)).optional(),
});
