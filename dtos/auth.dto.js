import * as yup from "yup";

export const registerDto = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be at most 100 characters")
    .required("Full name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email must be a valid email address")
    .required("Email is required"),
});

export const verifyOtpDto = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be at most 100 characters")
    .required("Full name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email must be a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .required("Password is required"),

  mobile: yup
    .string()
    .trim()
    .matches(
      /^\+?[1-9]\d{9,14}$/,
      "Mobile number must be 10–15 digits and may start with +",
    )
    .required("Mobile number is required"),

  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d{6}$/, "OTP must contain only digits")
    .required("OTP is required"),
  instituteCode: yup
    .string()
    .required("Institute code is required"),
});

export const forgotPasswordDto = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email must be a valid email address")
    .required("Email is required"),
});

export const loginDto = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .required("Password is required"),
});

export const resetPasswordDto = yup.object({
  token: yup
    .string()
    .required("Reset token is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .required("Password is required"),
});
