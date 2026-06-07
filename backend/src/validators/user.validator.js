const validator = require("validator");
const AppError = require("../utils/app-error");

const throwIfErrors = (errors) => {
  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }
};

const validateName = (name, errors) => {
  if (name === undefined) {
    return undefined;
  }

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    errors.push({ field: "name", message: "Name must be between 2 and 80 characters" });
    return undefined;
  }

  return name.trim();
};

const validateAvatarUrl = (avatarUrl, errors) => {
  if (avatarUrl === undefined) {
    return undefined;
  }

  if (avatarUrl === null || avatarUrl === "") {
    return null;
  }

  if (typeof avatarUrl !== "string" || !validator.isURL(avatarUrl, { protocols: ["http", "https"], require_protocol: true })) {
    errors.push({ field: "avatarUrl", message: "Avatar URL must be a valid HTTP or HTTPS URL" });
    return undefined;
  }

  return avatarUrl.trim();
};

const validatePasswordStrength = (password, field, errors) => {
  if (typeof password !== "string" || password.length < 8) {
    errors.push({ field, message: "Password must be at least 8 characters" });
    return;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({ field, message: "Password must include an uppercase letter" });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({ field, message: "Password must include a lowercase letter" });
  }

  if (!/\d/.test(password)) {
    errors.push({ field, message: "Password must include a number" });
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push({ field, message: "Password must include a special character" });
  }
};

const validateUpdateProfilePayload = (payload) => {
  const errors = [];
  const updates = {};
  const name = validateName(payload.name, errors);
  const avatarUrl = validateAvatarUrl(payload.avatarUrl, errors);

  if (name !== undefined) {
    updates.name = name;
  }

  if (avatarUrl !== undefined) {
    updates.avatarUrl = avatarUrl;
  }

  if (Object.keys(updates).length === 0) {
    errors.push({ field: "profile", message: "At least one profile field is required" });
  }

  throwIfErrors(errors);
  return updates;
};

const validateChangePasswordPayload = (payload) => {
  const errors = [];

  if (typeof payload.currentPassword !== "string" || payload.currentPassword.length === 0) {
    errors.push({ field: "currentPassword", message: "Current password is required" });
  }

  validatePasswordStrength(payload.newPassword, "newPassword", errors);

  if (payload.newPassword !== payload.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Password confirmation must match" });
  }

  throwIfErrors(errors);

  return {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword
  };
};

module.exports = {
  validateUpdateProfilePayload,
  validateChangePasswordPayload
};
