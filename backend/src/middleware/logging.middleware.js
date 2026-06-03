const crypto = require("crypto");
const pinoHttp = require("pino-http");
const logger = require("../config/logger");

const requestIdMiddleware = (req, res, next) => {
  req.id = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
};

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id,
  customProps: (req) => ({
    requestId: req.id
  }),
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.originalUrl} completed with ${res.statusCode}`,
  customErrorMessage: (req, res) => `${req.method} ${req.originalUrl} failed with ${res.statusCode}`
});

module.exports = {
  requestIdMiddleware,
  httpLogger
};
