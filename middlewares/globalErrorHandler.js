import logger from "../utils/logger.js";

const errorLogger = logger.namespaceLogger("ERROR");

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message =
    err.message || "Something went wrong. Please try again later.";

  errorLogger.error("Unhandled error", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message,
    stack: err.stack,
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
