const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");
const AppError = require("../utils/app-error");

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new AppError("Origin is not allowed by CORS", 403, "CORS_NOT_ALLOWED"));
  },
  credentials: true
};

const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later."
    }
  }
});

const applySecurityMiddleware = (app) => {
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(compression());
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(apiRateLimiter);
};

module.exports = {
  applySecurityMiddleware
};
