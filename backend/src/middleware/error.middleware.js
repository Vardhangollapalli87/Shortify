const AppError = require("../utils/app-error");
const logger = require("../config/logger");
const { env } = require("../config/env");

const formatError = (error) => ({
  success: false,
  error: {
    code: error.code || "INTERNAL_SERVER_ERROR",
    message: error.message || "Something went wrong",
    ...(error.details ? { details: error.details } : {})
  }
});

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error.name === "ValidationError") {
    return new AppError("Validation failed", 400, "VALIDATION_ERROR", error.errors);
  }

  if (error.name === "CastError") {
    return new AppError("Invalid resource identifier", 400, "INVALID_IDENTIFIER");
  }

  if (error.code === 11000) {
    return new AppError("Duplicate field value", 409, "DUPLICATE_RESOURCE", error.keyValue);
  }

  return error;
};

const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, "ROUTE_NOT_FOUND"));
};

const globalErrorHandler = (error, req, res, _next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || 500;
  const isProduction = env.nodeEnv === "production";

  const logPayload = {
    err: normalizedError,
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode
  };

  if (statusCode >= 500) {
    logger.error(logPayload, normalizedError.message);
  } else {
    logger.warn(
      {
        ...logPayload,
        err: {
          message: normalizedError.message,
          code: normalizedError.code,
          details: normalizedError.details
        }
      },
      normalizedError.message
    );
  }

  const responseBody = normalizedError.isOperational || !isProduction
    ? formatError(normalizedError)
    : formatError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong"
      });

  if (!isProduction && normalizedError.stack) {
    responseBody.error.stack = normalizedError.stack;
  }

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
