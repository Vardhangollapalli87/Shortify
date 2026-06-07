const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "CORS_ORIGINS",
  "CLIENT_URL",
  "CLIENT_PASSWORD_RESET_URL",
  "CLIENT_OAUTH_SUCCESS_URL",
  "CLIENT_OAUTH_FAILURE_URL"
];

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getCorsOrigins = () => {
  const origins = process.env.CORS_ORIGINS || "";

  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseNumber(process.env.PORT, 5000),
  mongodbUri: process.env.MONGODB_URI,
  corsOrigins: getCorsOrigins(),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || "10kb",
  rateLimitWindowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: parseNumber(process.env.RATE_LIMIT_MAX, 100),
  logLevel: process.env.LOG_LEVEL || "info",
  redisUrl: process.env.REDIS_URL || null,
  redirectCacheTtlSeconds: parseNumber(process.env.REDIRECT_CACHE_TTL_SECONDS, 24 * 60 * 60),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  refreshTokenRotationGraceSeconds: parseNumber(process.env.REFRESH_TOKEN_ROTATION_GRACE_SECONDS, 10),
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || "shortify_refresh_token",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  clientUrl: process.env.CLIENT_URL,
  passwordResetTokenExpiresMinutes: parseNumber(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES, 15),
  clientPasswordResetUrl: process.env.CLIENT_PASSWORD_RESET_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  googleOAuthStateCookieName: process.env.GOOGLE_OAUTH_STATE_COOKIE_NAME || "shortify_google_oauth_state",
  clientOAuthSuccessUrl: process.env.CLIENT_OAUTH_SUCCESS_URL,
  clientOAuthFailureUrl: process.env.CLIENT_OAUTH_FAILURE_URL
};

const validateEnv = () => {
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
};

module.exports = {
  env,
  validateEnv
};
