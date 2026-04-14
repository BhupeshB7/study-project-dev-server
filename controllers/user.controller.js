import * as userService from "../services/user.service.js";
import { verifyOtpAndCreateUserDto } from "../dtos/user.dto.js";

const SESSION_COOKIE_NAME = "study_project_session";
const COOKIE_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
export const createUserByInstituteController = async (req, res, next) => {
  try {
    const user = await userService.createUserByInstitute(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "User created successfully and email sent",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    const result = await userService.sendRegisterOtp(fullName, email);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtpAndCreateUser = async (req, res, next) => {
  try {
    await verifyOtpAndCreateUserDto.validate(req.body);
    const { fullName, email, password, mobile, otp, instituteCode } = req.body;
    const result = await userService.verifyOtpAndCreateUser(
      fullName,
      email,
      password,
      mobile,
      otp,
      instituteCode,
    );
    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(
      email,
      password,
      req.headers["user-agent"],
    );
    res.cookie(SESSION_COOKIE_NAME, result.sessionId, COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies[SESSION_COOKIE_NAME];
    await userService.logoutSession(sessionId);
    res.clearCookie(SESSION_COOKIE_NAME);
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAllDevicesController = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies[SESSION_COOKIE_NAME];
    await userService.logoutAllSessions(sessionId);
    res.clearCookie(SESSION_COOKIE_NAME);
    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveSessions = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies[SESSION_COOKIE_NAME];
    const sessions = await userService.getUserSessions(sessionId);
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await userService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await userService.resetPassword(token, password);
    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
