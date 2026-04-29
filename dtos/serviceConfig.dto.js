import * as yup from "yup";
import { DocumentRequirementStatus, SlotDayOfWeek } from "../enum/serviceConfig.enum.js";

const documentRequirementDto = yup.object({
  name: yup.string().trim().required("Document name is required").max(150),
  status: yup
    .string()
    .oneOf(Object.values(DocumentRequirementStatus))
    .default(DocumentRequirementStatus.REQUIRED),
  description: yup.string().max(300).nullable(),
});

const slotConfigDto = yup.object({
  dayOfWeek: yup
    .string()
    .required("Day of week is required")
    .oneOf(Object.values(SlotDayOfWeek)),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  slotDurationMinutes: yup.number().min(5).default(30),
  maxConcurrent: yup.number().min(1).default(1),
});

export const createServiceConfigDto = yup.object({
  serviceId: yup.string().required("Service ID is required"),
  requiredDocuments: yup.array().of(documentRequirementDto).default([]),
  slots: yup.array().of(slotConfigDto).default([]),
  maxActiveRequestsPerUser: yup.number().min(1).default(1),
  allowAppointments: yup.boolean().default(false),
  allowQueue: yup.boolean().default(true),
  eligibleRoles: yup.array().of(yup.string()).default(["student"]),
  processingDays: yup.number().nullable(),
  notes: yup.string().max(1000).nullable(),
});

export const updateServiceConfigDto = yup.object({
  requiredDocuments: yup.array().of(documentRequirementDto),
  slots: yup.array().of(slotConfigDto),
  maxActiveRequestsPerUser: yup.number().min(1),
  allowAppointments: yup.boolean(),
  allowQueue: yup.boolean(),
  eligibleRoles: yup.array().of(yup.string()),
  processingDays: yup.number().nullable(),
  notes: yup.string().max(1000).nullable(),
});
