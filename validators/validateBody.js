import { ValidationError } from "yup";
import logger from "../utils/logger.js";

const validationLogger = logger.namespaceLogger("VALIDATION");

export const validateBody = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    validationLogger.debug("Request body validated successfully", {
      path: req.originalUrl,
      method: req.method,
    });

    return next();
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      validationLogger.error("Unexpected validation error", {
        path: req.originalUrl,
        method: req.method,
        message: error.message,
        stack: error.stack,
      });

      return next(error);
    }

    const issues = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    validationLogger.warn("Request body validation failed", {
      path: req.originalUrl,
      method: req.method,
      errors: issues,
    });

    return res.status(400).json({
      success: false,
      message: issues[0]?.message || "Invalid request body",
      errors: issues,
    });
  }
};
