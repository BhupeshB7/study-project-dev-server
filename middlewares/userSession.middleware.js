import redisClient from "../config/redis.js";
import { UserModel } from "../models/user.model.js";
import logger from "../utils/logger.js";

const SESSION_PREFIX = "user:sessions:";
const SESSION_COOKIE_NAME = "study_project_session";

const sessionLogger = logger.namespaceLogger("SESSION");


export const userSessionMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies[SESSION_COOKIE_NAME];
    if (!sessionId) {
      req.user = null;
      req.sessionId = null;
      return next();
    }
    const [userId, timestamp] = sessionId.split(":");
    if (!userId || !timestamp) {
      req.user = null;
      req.sessionId = null;
      return next();
    }

    const sessionKey = `${SESSION_PREFIX}${userId}`;
    const rawSessions = await redisClient.lrange(sessionKey, 0, -1);

    const activeSession = rawSessions
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
      req.user = null;
      req.sessionId = null;
      return next();
    }

    const user = await UserModel.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!user) {
      req.user = null;
      req.sessionId = null;
      sessionLogger.warn("Session exists in Redis but user not found in DB", { userId });
      return next();
    }

    req.user = user;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    sessionLogger.error("Session middleware error", {
      message: error.message,
      stack: error.stack,
    });
    req.user = null;
    req.sessionId = null;
    next();
  }
};
