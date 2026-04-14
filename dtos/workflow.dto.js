import * as yup from "yup";

const workflowStepDto = yup.object({
  order: yup.number().required("Step order is required").min(1),
  name: yup.string().required("Step name is required").max(100),
  type: yup
    .string()
    .required("Step type is required")
    .oneOf([
      "approval",
      "document_upload",
      "review",
      "notification",
      "auto_assign",
      "payment",
      "queue_visit",
    ]),
  description: yup.string().max(500).nullable(),
  assignToRole: yup.string().nullable(),
  isRequired: yup.boolean().default(true),
});

export const createWorkflowTemplateDto = yup.object({
  name: yup.string().required("Name is required").max(150),
  serviceId: yup.string().required("Service ID is required"),
  description: yup.string().max(500).nullable(),
  steps: yup
    .array()
    .of(workflowStepDto)
    .min(1, "At least one step is required")
    .required(),
});

export const updateWorkflowTemplateDto = yup.object({
  name: yup.string().max(150),
  description: yup.string().max(500).nullable(),
  status: yup.string().oneOf(["active", "inactive"]),
  steps: yup.array().of(workflowStepDto).min(1),
});

export const advanceWorkflowDto = yup.object({
  remarks: yup.string().max(1000).nullable(),
});

export const rejectWorkflowDto = yup.object({
  reason: yup.string().required("Rejection reason is required").max(1000),
});
