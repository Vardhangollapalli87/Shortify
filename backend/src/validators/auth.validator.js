const validator = require("validator");
const AppError = require("../utils/app-error");

const validateRequiredString = (value, field, errors) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push({ field, message: `${field} is required` });
    return null;
  }

  return value.trim();
};

const validatePassword = (password, errors) => {
  if (typeof password !== "string" || password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters" });
    return;
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must include uppercase, lowercase, and number characters"
    });
  }
};

const throwIfErrors = (errors) => {
  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }
};

const validateRegisterPayload = (payload) => {
  const errors = [];
  const name = validateRequiredString(payload.name, "name", errors);
  const email = validateRequiredString(payload.email, "email", errors);

  if (email && !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  validatePassword(payload.password, errors);
  throwIfErrors(errors);

  return {
    name,
    email: email.toLowerCase(),
    password: payload.password
  };
};

const validateLoginPayload = (payload) => {
  const errors = [];
  const email = validateRequiredString(payload.email, "email", errors);
  const password = validateRequiredString(payload.password, "password", errors);

  if (email && !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  throwIfErrors(errors);

  return {
    email: email.toLowerCase(),
    password
  };
};

const validateForgotPasswordPayload = (payload) => {
  const errors = [];
  const email = validateRequiredString(payload.email, "email", errors);

  if (email && !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  throwIfErrors(errors);

  return {
    email: email.toLowerCase()
  };
};

const validateResetPasswordPayload = (payload) => {
  const errors = [];
  const token = validateRequiredString(payload.token, "token", errors);
  validatePassword(payload.password, errors);
  throwIfErrors(errors);

  return {
    token,
    password: payload.password
  };
};

const validateVerifyEmailPayload = (payload) => {
  const errors = [];
  const token = validateRequiredString(payload.token, "token", errors);
  throwIfErrors(errors);

  return { token };
};

const validateResendVerificationPayload = (payload) => {
  const errors = [];
  const email = validateRequiredString(payload.email, "email", errors);

  if (email && !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  throwIfErrors(errors);

  return {
    email: email.toLowerCase()
  };
};

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload,
  validateVerifyEmailPayload,
  validateResendVerificationPayload
};
