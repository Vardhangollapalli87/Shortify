const { env } = require("../config/env");
const userService = require("../services/user.service");
const catchAsync = require("../utils/catch-async");
const sendResponse = require("../utils/send-response");
const {
  validateChangePasswordPayload,
  validateUpdateProfilePayload
} = require("../validators/user.validator");

const getRefreshCookieClearOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  domain: env.cookieDomain,
  path: "/api/v1/auth"
});

const getMe = catchAsync(async (req, res) => {
  const user = await userService.getProfile({ userId: req.user._id });
  return sendResponse(res, 200, { user }, "Profile retrieved successfully");
});

const updateMe = catchAsync(async (req, res) => {
  const updates = validateUpdateProfilePayload(req.body);
  const user = await userService.updateProfile({ userId: req.user._id, updates });
  return sendResponse(res, 200, { user }, "Profile updated successfully");
});

const changePassword = catchAsync(async (req, res) => {
  const payload = validateChangePasswordPayload(req.body);
  const user = await userService.changePassword({ userId: req.user._id, ...payload });
  return sendResponse(res, 200, { user }, "Password changed successfully");
});

const deleteMe = catchAsync(async (req, res) => {
  const result = await userService.deleteAccount({ userId: req.user._id });
  res.clearCookie(env.refreshTokenCookieName, getRefreshCookieClearOptions());
  return sendResponse(res, 200, result, "Account deleted successfully");
});

module.exports = {
  getMe,
  updateMe,
  changePassword,
  deleteMe
};
