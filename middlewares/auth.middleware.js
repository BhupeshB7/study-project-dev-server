import redisClient from "../config/redis.js";
import { UserModel } from "../models/user.model.js";
import logger from "../utils/logger.js";

const SESSION_PREFIX = "user:sessions:";
const SESSION_COOKIE_NAME = "study_project_session";

const authLogger = logger.namespaceLogger("AUTH");

export const authenticate = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const [userId] = sessionId.split(":");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid session",
      });
    }

    const sessionKey = `${SESSION_PREFIX}${userId}`;
    const sessions = await redisClient.lrange(sessionKey, 0, -1);

    const activeSession = sessions
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .find((s) => s.sessionId === sessionId);

    if (!activeSession) {
      return res.status(401).json({
        success: false,
        message: "Session expired or logged out",
      });
    }

    const user = await UserModel.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );
   console.log("Session valid for user ID:", user);
    if (!user) {
      authLogger.warn("Session valid but user not found", { userId });
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }
    console.log("Authenticated user:", {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      instituteId: user.instituteId,
      role: user.role,
    });
    req.user = user;
    req.sessionId = sessionId;

    next();
  } catch (error) {
    authLogger.error("Authentication failed", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};
