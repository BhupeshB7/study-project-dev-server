import * as yup from "yup";

export const askQuestionDto = yup.object({
  question: yup
    .string()
    .required("Question is required")
    .min(3, "Question too short")
    .max(500),
});

export const createFaqDto = yup.object({
  question: yup.string().required("Question is required").max(500),
  answer: yup.string().required("Answer is required").max(2000),
  category: yup.string().required("Category is required").max(100),
  keywords: yup
    .array()
    .of(yup.string().max(50))
    .min(1, "At least one keyword is required")
    .required(),
  isActive: yup.boolean().default(true),
});

export const updateFaqDto = yup.object({
  question: yup.string().max(500),
  answer: yup.string().max(2000),
  category: yup.string().max(100),
  keywords: yup.array().of(yup.string().max(50)),
  isActive: yup.boolean(),
});
