const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const ShortUrl = require("../models/url.model");
const RefreshToken = require("../models/refresh-token.model");
const AppError = require("../utils/app-error");
const { AUTH_PROVIDERS } = require("../constants/auth.constants");

const PASSWORD_SALT_ROUNDS = 12;

const getProfile = async ({ userId }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user.toSafeObject();
};

const updateProfile = async ({ userId, updates }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user.toSafeObject();
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (user.authProvider === AUTH_PROVIDERS.GOOGLE || !user.passwordHash) {
    throw new AppError("Password is managed through Google", 403, "PASSWORD_MANAGED_BY_GOOGLE");
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 401, "CURRENT_PASSWORD_INVALID");
  }

  user.passwordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);
  user.passwordChangedAt = new Date();
  await user.save();

  await RefreshToken.updateMany(
    { userId: user._id, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  return user.toSafeObject();
};

const deleteAccount = async ({ userId }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await Promise.all([
    ShortUrl.deleteMany({ userId: user._id }),
    RefreshToken.updateMany(
      { userId: user._id, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    )
  ]);

  await User.deleteOne({ _id: user._id });

  return { deleted: true };
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
};
