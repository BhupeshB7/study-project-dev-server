export const verifyOtpAndCreateUserDto = yup.object({
  fullName: yup.string().trim().min(3).max(100).required(),
  email: yup.string().email().lowercase().required(),
  password: yup.string().min(6).max(100).required(),
  mobile: yup
    .string()
    .matches(/^[+]?\d{10,15}$/)
    .required(),
  otp: yup.string().required(),
  instituteCode: yup.string().trim().required(),
});
import * as yup from "yup";
import { UserRole } from "../enum/user.enum.js";

export const createUserDto = yup.object({
  fullName: yup.string().trim().min(3).max(100).required(),
  email: yup.string().email().lowercase().required(),
  mobile: yup
    .string()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .required(),
  role: yup
    .string()
    .oneOf([UserRole.ADMIN, UserRole.STAFF, UserRole.STUDENT])
    .required(),
});
