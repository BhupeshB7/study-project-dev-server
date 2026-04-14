import * as yup from "yup";

export const submitServiceRequestDto = yup.object({
  serviceId: yup.string().required("Service ID is required"),
  description: yup.string().max(2000).nullable(),
  priority: yup
    .string()
    .oneOf(["low", "normal", "high", "urgent"])
    .default("normal"),
});

export const reviewServiceRequestDto = yup.object({
  action: yup
    .string()
    .required("Action is required")
    .oneOf(["approve", "reject", "request_docs", "in_progress", "complete"]),
  remarks: yup.string().max(1000).nullable(),
});

export const addRemarkDto = yup.object({
  text: yup.string().required("Remark text is required").max(1000),
});
