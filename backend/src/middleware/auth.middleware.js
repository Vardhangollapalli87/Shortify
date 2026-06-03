const User = require("../models/user.model");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const { verifyAccessToken } = require("../utils/token");

const getBearerToken = (req) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
};

const protect = catchAsync(async (req, _res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    throw new AppError("Authentication token is required", 401, "AUTHENTICATION_REQUIRED");
  }

  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new AppError("Authentication token is invalid or expired", 401, "INVALID_ACCESS_TOKEN");
  }

  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new AppError("The user for this token no longer exists", 401, "USER_NOT_FOUND");
  }

  if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
    throw new AppError("Password changed recently. Please login again.", 401, "TOKEN_STALE");
  }

  req.user = user;
  next();
});

const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication is required", 401, "AUTHENTICATION_REQUIRED"));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403, "FORBIDDEN"));
  }

  return next();
};

module.exports = {
  protect,
  authorize
};
