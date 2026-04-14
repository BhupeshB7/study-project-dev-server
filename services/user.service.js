import crypto from "crypto";
import mongoose from "mongoose";
import { UAParser } from "ua-parser-js";
import config from "../config/constant.js";
import redisClient from "../config/redis.js";
import { UserRole, UserStatus } from "../enum/user.enum.js";
import { InstituteModel } from "../models/institute.model.js";
import { OtpModel } from "../models/otp.model.js";
import { UserModel } from "../models/user.model.js";
import { compareOtp, generateOtp, hashOtp } from "../utils/generate-otp.js";
import {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendWelcomeUserEmail,
} from "./email.service.js";

const SESSION_PREFIX = "user:sessions:";
const SESSION_TTL = 60 * 60 * 24 * 7;

function getSessionKey(userId) {
  return `${SESSION_PREFIX}${userId}`;
}

async function getSessionList(userId) {
  const raw = await redisClient.lrange(getSessionKey(userId), 0, -1);
  return raw
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

const ROLE_MATRIX = {
  [UserRole.SYSTEM_ADMIN]: [UserRole.ADMIN],
  [UserRole.ADMIN]: [UserRole.STAFF, UserRole.STUDENT],
  [UserRole.STAFF]: [UserRole.STUDENT],
};

const assertRolePermission = (creatorRole, newRole) => {
  const allowed = ROLE_MATRIX[creatorRole] || [];
  if (!allowed.includes(newRole)) {
    const err = new Error("You are not allowed to create this user role");
    err.statusCode = 403;
    throw err;
  }
};

export const createUserByInstitute = async (payload, creator) => {
  assertRolePermission(creator.role, payload.role);

  const existing = await UserModel.findOne({ email: payload.email });
  if (existing) {
    const err = new Error("User already exists with this email");
    err.statusCode = 409;
    throw err;
  }

  const firstName = payload.fullName.trim().split(" ")[0];
  const mobileLast4 = payload.mobile.replace(/\D/g, "").slice(-4);
  const password = `${firstName}@${mobileLast4}`;

  const user = await UserModel.create({
    fullName: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    role: payload.role,
    password,
    instituteId: creator.instituteId,
    status: UserStatus.ACTIVE,
  });

  const institute = await InstituteModel.findById(creator.instituteId);

  await sendWelcomeUserEmail({
    to: user.email,
    fullName: user.fullName,
    email: user.email,
    password,
    instituteName: institute?.name || "Your Institute",
  });

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    password,
  };
};

export const sendRegisterOtp = async (fullName, email) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const error = new Error("Account already exists. Please login.");
    error.statusCode = 409;
    throw error;
  }

  const existingOtp = await OtpModel.findOne({ email });
  const now = new Date();

  if (existingOtp) {
    if (existingOtp.expiresAt > now) {
      const diffSeconds = Math.floor((now - existingOtp.createdAt) / 1000);
      if (diffSeconds < 60) {
        const error = new Error(
          `Please wait ${60 - diffSeconds} seconds before requesting a new OTP`,
        );
        error.statusCode = 429;
        throw error;
      }
    }
    await existingOtp.deleteOne();
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  await OtpModel.create({ email, otpHash, expiresAt, verified: false });
  await sendOtpEmail({ to: email, otp, fullName });

  return { email, expiresAt };
};

export const verifyOtpAndCreateUser = async (
  fullName,
  email,
  password,
  mobile,
  otp,
  instituteCode,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const institute = await InstituteModel.findOne({
      code: instituteCode,
    }).session(session);
    if (!institute) {
      const error = new Error(
        "Institute not found. Please check the code and try again.",
      );
      error.statusCode = 404;
      throw error;
    }

    const otpRecord = await OtpModel.findOne({ email }).session(session);
    if (!otpRecord) {
      const error = new Error("OTP not found. Please request a new one.");
      error.statusCode = 400;
      throw error;
    }

    if (otpRecord.expiresAt < new Date()) {
      const error = new Error("OTP has expired. Please request a new one.");
      error.statusCode = 400;
      throw error;
    }

    const isValid = await compareOtp(otp, otpRecord.otpHash);
    if (!isValid) {
      const error = new Error("Invalid OTP. Please try again.");
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.create(
      [
        {
          fullName,
          email,
          password,
          mobile,
          status: UserStatus.INACTIVE,
          instituteId: institute._id,
        },
      ],
      { session },
    );

    await otpRecord.deleteOne({ session });
    await session.commitTransaction();
    session.endSession();

    return { userId: user[0]._id, email: user[0].email };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const loginUser = async (email, password, userAgent) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const parser = new UAParser(userAgent);
  const ua = parser.getResult();

  const sessionId = `${user._id}:${Date.now()}`;

  await redisClient
    .multi()
    .lpush(
      getSessionKey(user._id),
      JSON.stringify({
        sessionId,
        deviceName: ua.device?.model || "Unknown Device",
        deviceType: `${ua.browser?.name || "Unknown Browser"} on ${
          ua.os?.name || "Unknown OS"
        }`,
        createdAt: Date.now(),
      })
    )
    .ltrim(getSessionKey(user._id), 0, 1)
    .expire(getSessionKey(user._id), SESSION_TTL)
    .exec();

  return {
    sessionId,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  };
};

export const logoutSession = async (sessionId) => {
  const [userId] = sessionId.split(":");
  if (!userId) {
    const error = new Error("Invalid session.");
    error.statusCode = 400;
    throw error;
  }

  let sessions = await getSessionList(userId);
  const originalLength = sessions.length;
  sessions = sessions.filter((s) => s.sessionId !== sessionId);

  if (sessions.length === originalLength) {
    const error = new Error("Session not found or already expired.");
    error.statusCode = 404;
    throw error;
  }

  const sessionKey = getSessionKey(userId);
  await redisClient.del(sessionKey);

  if (sessions.length > 0) {
    await redisClient.rpush(
      sessionKey,
      ...sessions.map((s) => JSON.stringify(s)),
    );
    await redisClient.expire(sessionKey, SESSION_TTL);
  }

  return true;
};

export const logoutAllSessions = async (sessionId) => {
  const [userId] = sessionId.split(":");
  if (!userId) {
    const error = new Error("Invalid session.");
    error.statusCode = 401;
    throw error;
  }

  const sessions = await getSessionList(userId);
  const found = sessions.find((s) => s.sessionId === sessionId);
  if (!found) {
    const error = new Error("Session not found or already expired.");
    error.statusCode = 401;
    throw error;
  }

  await redisClient.del(getSessionKey(userId));
  return true;
};

export const getUserSessions = async (sessionId) => {
  const [userId] = sessionId.split(":");
  const sessions = await getSessionList(userId);
  return sessions.map(
    ({ sessionId: sId, deviceName, deviceType, createdAt }) => ({
      sessionId: sId,
      deviceName,
      deviceType,
      createdAt,
      isCurrent: sId === sessionId,
    }),
  );
};

export const forgotPassword = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;

  await sendPasswordResetEmail({
    to: user.email,
    resetUrl,
    fullName: user.fullName,
  });
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    const error = new Error("Invalid or expired reset token.");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};
