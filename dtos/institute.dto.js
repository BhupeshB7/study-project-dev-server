import * as yup from "yup";

export const createInstituteDto = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Institute name must be at least 3 characters")
    .max(200, "Institute name must be at most 200 characters")
    .required("Institute name is required"),

  code: yup
    .string()
    .trim()
    .uppercase()
    .min(3, "Institute code must be at least 3 characters")
    .max(20, "Institute code must be at most 20 characters")
    .required("Institute code is required"),
});
