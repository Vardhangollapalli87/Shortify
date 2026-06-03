const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const AppError = require("../utils/app-error");
const { AUTH_PROVIDERS } = require("../constants/auth.constants");
const { env } = require("../config/env");
const { createAuthTokens, rotateRefreshToken, revokeRefreshToken } = require("./token.service");
const { sendPasswordResetEmail } = require("./email.service");
const { exchangeCodeForTokens, getGoogleProfile } = require("./google-oauth.service");

const PASSWORD_SALT_ROUNDS = 12;

const register = async ({ name, email, password, req }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    passwordHash,
    authProvider: AUTH_PROVIDERS.CREDENTIALS
  });

  const tokens = await createAuthTokens({ user, req });

  return {
    user: user.toSafeObject(),
    ...tokens
  };
};

const login = async ({ email, password, req }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await createAuthTokens({ user, req });

  return {
    user: user.toSafeObject(),
    ...tokens
  };
};

const authenticateWithGoogle = async ({ code, req }) => {
  const googleTokens = await exchangeCodeForTokens(code);
  const googleProfile = await getGoogleProfile(googleTokens.access_token);

  if (!googleProfile.isEmailVerified) {
    throw new AppError("Google account email is not verified", 401, "GOOGLE_EMAIL_NOT_VERIFIED");
  }

  let user = await User.findOne({ googleId: googleProfile.googleId });

  if (!user) {
    user = await User.findOne({ email: googleProfile.email });
  }

  if (user) {
    if (!user.googleId) {
      user.googleId = googleProfile.googleId;
    }

    user.name = user.name || googleProfile.name;
    user.avatarUrl = googleProfile.avatarUrl || user.avatarUrl;
    user.isEmailVerified = user.isEmailVerified || googleProfile.isEmailVerified;

    if (user.authProvider === AUTH_PROVIDERS.CREDENTIALS) {
      user.authProvider = AUTH_PROVIDERS.MIXED;
    }
  } else {
    user = new User({
      name: googleProfile.name,
      email: googleProfile.email,
      googleId: googleProfile.googleId,
      avatarUrl: googleProfile.avatarUrl,
      authProvider: AUTH_PROVIDERS.GOOGLE,
      isEmailVerified: googleProfile.isEmailVerified
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await createAuthTokens({ user, req });

  return {
    user: user.toSafeObject(),
    ...tokens
  };
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    return false;
  }

  try {
    return await revokeRefreshToken(refreshToken);
  } catch {
    return false;
  }
};

const refresh = async ({ refreshToken, req }) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401, "REFRESH_TOKEN_REQUIRED");
  }

  try {
    const result = await rotateRefreshToken({ refreshToken, req });

    if (!result) {
      throw new AppError("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    return {
      user: result.user.toSafeObject(),
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    };
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }

    throw new AppError("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
  }
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordResetTokenHash +passwordResetExpiresAt"
  );

  if (!user) {
    return { queued: true };
  }

  const resetToken = user.createPasswordResetToken(env.passwordResetTokenExpiresMinutes);
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    resetToken
  });

  return { queued: true };
};

const resetPassword = async ({ token, password }) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() }
  }).select("+passwordResetTokenHash +passwordResetExpiresAt +passwordHash");

  if (!user) {
    throw new AppError("Password reset token is invalid or expired", 400, "INVALID_RESET_TOKEN");
  }

  user.passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  user.passwordChangedAt = new Date();
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  return {
    user: user.toSafeObject()
  };
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  authenticateWithGoogle
};
