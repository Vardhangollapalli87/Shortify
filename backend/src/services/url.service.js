const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const ShortUrl = require("../models/url.model");
const AppError = require("../utils/app-error");
const { deleteRedirectCache } = require("./cache.service");

const PASSWORD_SALT_ROUNDS = 10;
const RESERVED_SHORT_CODES = new Set([
  "api",
  "auth",
  "dashboard",
  "login",
  "register",
  "health",
  "favicon.ico"
]);

const validateOriginalUrl = (originalUrl) => {
  if (!validator.isURL(originalUrl, { protocols: ["http", "https"], require_protocol: true })) {
    throw new AppError("Original URL must be a valid HTTP or HTTPS URL", 400, "INVALID_URL");
  }
};

const normalizeShortCode = (shortCode) => {
  const normalized = typeof shortCode === "string" ? shortCode.trim() : "";

  if (!normalized) {
    return null;
  }

  return normalized;
};

const validateShortCode = (shortCode) => {
  const normalized = normalizeShortCode(shortCode);

  if (!normalized) {
    return null;
  }

  if (normalized.length < 3 || normalized.length > 32) {
    throw new AppError("Short code must be between 3 and 32 characters", 400, "INVALID_SHORT_CODE");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(normalized)) {
    throw new AppError("Short code may only contain letters, numbers, underscores, and hyphens", 400, "INVALID_SHORT_CODE");
  }

  if (RESERVED_SHORT_CODES.has(normalized.toLowerCase())) {
    throw new AppError("This short code is reserved", 400, "SHORT_CODE_RESERVED");
  }

  return normalized;
};

const validateExpiresAt = (expiresAt) => {
  if (expiresAt === undefined || expiresAt === null || expiresAt === "") {
    return null;
  }

  const parsedDate = new Date(expiresAt);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError("Expiration date is invalid", 400, "INVALID_EXPIRATION_DATE");
  }

  if (parsedDate.getTime() <= Date.now()) {
    throw new AppError("Expiration date must be in the future", 400, "INVALID_EXPIRATION_DATE");
  }

  return parsedDate;
};

const validateUrlId = (urlId) => {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    throw new AppError("Invalid resource identifier", 400, "INVALID_IDENTIFIER");
  }
};

const ensureOwnedUrl = async ({ userId, urlId }) => {
  validateUrlId(urlId);

  const url = await ShortUrl.findOne({ _id: urlId, userId }).lean();

  if (!url) {
    throw new AppError("You do not have access to this short link", 404, "LINK_NOT_FOUND");
  }

  return url;
};

const generateShortCode = async () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    let candidate = "";

    for (let index = 0; index < 6; index += 1) {
      candidate += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    if (RESERVED_SHORT_CODES.has(candidate.toLowerCase())) {
      continue;
    }

    const existing = await ShortUrl.findOne({ shortCode: candidate }).lean();

    if (!existing) {
      return candidate;
    }
  }

  throw new AppError("Unable to generate a unique short code", 500, "SHORT_CODE_GENERATION_FAILED");
};

const createUrl = async ({ userId, originalUrl, shortCode, title, expiresAt, password, isActive = true }) => {
  validateOriginalUrl(originalUrl);

  const normalizedShortCode = validateShortCode(shortCode || "") || await generateShortCode();
  const existingAlias = await ShortUrl.findOne({ shortCode: normalizedShortCode }).lean();

  if (existingAlias) {
    throw new AppError("This short code is already in use", 409, "SHORT_CODE_ALREADY_EXISTS");
  }

  const expiresAtValue = validateExpiresAt(expiresAt);

  const passwordHash = typeof password === "string" && password.trim().length > 0
    ? await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    : null;

  const url = await ShortUrl.create({
    userId,
    originalUrl: originalUrl.trim(),
    shortCode: normalizedShortCode,
    title: title ? title.trim() : null,
    isActive,
    expiresAt: expiresAtValue,
    passwordHash
  });

  return url.toObject();
};

const getUrls = async ({ userId }) => {
  const urls = await ShortUrl.find({ userId }).sort({ createdAt: -1 }).lean();

  return urls.map((url) => ({
    id: url._id.toString(),
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    title: url.title || null,
    isActive: url.isActive,
    expiresAt: url.expiresAt ? url.expiresAt.toISOString() : null,
    isPasswordProtected: Boolean(url.passwordHash),
    totalClicks: url.totalClicks || 0,
    uniqueClicks: url.uniqueClicks || 0,
    lastClickedAt: url.lastClickedAt ? url.lastClickedAt.toISOString() : null,
    createdAt: url.createdAt,
    updatedAt: url.updatedAt
  }));
};

const getUrl = async ({ userId, urlId }) => {
  const url = await ensureOwnedUrl({ userId, urlId });

  return {
    id: url._id.toString(),
    userId: url.userId.toString(),
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    title: url.title || null,
    isActive: url.isActive,
    expiresAt: url.expiresAt ? url.expiresAt.toISOString() : null,
    isPasswordProtected: Boolean(url.passwordHash),
    totalClicks: url.totalClicks || 0,
    uniqueClicks: url.uniqueClicks || 0,
    lastClickedAt: url.lastClickedAt ? url.lastClickedAt.toISOString() : null,
    createdAt: url.createdAt,
    updatedAt: url.updatedAt
  };
};

const updateUrl = async ({ userId, urlId, updates }) => {
  const existing = await ensureOwnedUrl({ userId, urlId });

  const payload = { ...updates };

  if (Object.prototype.hasOwnProperty.call(payload, "originalUrl")) {
    validateOriginalUrl(payload.originalUrl);
    payload.originalUrl = payload.originalUrl.trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, "shortCode")) {
    const nextShortCode = validateShortCode(payload.shortCode);

    if (nextShortCode && nextShortCode !== existing.shortCode) {
      const duplicate = await ShortUrl.findOne({ shortCode: nextShortCode, _id: { $ne: urlId } }).lean();

      if (duplicate) {
        throw new AppError("This short code is already in use", 409, "SHORT_CODE_ALREADY_EXISTS");
      }
    }

    payload.shortCode = nextShortCode;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "expiresAt")) {
    payload.expiresAt = validateExpiresAt(payload.expiresAt);
  }

  if (Object.prototype.hasOwnProperty.call(payload, "title")) {
    payload.title = payload.title ? payload.title.trim() : null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "password")) {
    if (typeof payload.password === "string" && payload.password.trim().length > 0) {
      payload.passwordHash = await bcrypt.hash(payload.password, PASSWORD_SALT_ROUNDS);
    } else {
      payload.passwordHash = null;
    }
    delete payload.password;
  }

  const url = await ShortUrl.findOneAndUpdate(
    { _id: urlId, userId },
    { $set: payload },
    { new: true, runValidators: true }
  ).lean();

  await deleteRedirectCache(url.shortCode);

  return url;
};

const deleteUrl = async ({ userId, urlId }) => {
  const url = await ensureOwnedUrl({ userId, urlId });

  await ShortUrl.deleteOne({ _id: urlId, userId });
  await deleteRedirectCache(url.shortCode);

  return { deleted: true, id: urlId };
};

const toggleUrl = async ({ userId, urlId }) => {
  const existing = await ensureOwnedUrl({ userId, urlId });
  const updated = await ShortUrl.findOneAndUpdate(
    { _id: urlId, userId },
    { $set: { isActive: !existing.isActive } },
    { new: true, runValidators: true }
  ).lean();

  await deleteRedirectCache(existing.shortCode);

  return { id: updated._id.toString(), isActive: updated.isActive };
};

const updatePasswordProtection = async ({ userId, urlId, password }) => {
  await ensureOwnedUrl({ userId, urlId });

  const passwordHash = typeof password === "string" && password.trim().length > 0
    ? await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    : null;

  const updated = await ShortUrl.findOneAndUpdate(
    { _id: urlId, userId },
    { $set: { passwordHash } },
    { new: true, runValidators: true }
  ).lean();

  await deleteRedirectCache(updated.shortCode);

  return { id: updated._id.toString(), isPasswordProtected: Boolean(updated.passwordHash) };
};

const updateExpiration = async ({ userId, urlId, expiresAt }) => {
  await ensureOwnedUrl({ userId, urlId });

  const parsedExpiresAt = validateExpiresAt(expiresAt);

  const updated = await ShortUrl.findOneAndUpdate(
    { _id: urlId, userId },
    { $set: { expiresAt: parsedExpiresAt } },
    { new: true, runValidators: true }
  ).lean();

  await deleteRedirectCache(updated.shortCode);

  return { id: updated._id.toString(), expiresAt: updated.expiresAt ? updated.expiresAt.toISOString() : null };
};

module.exports = {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  toggleUrl,
  updatePasswordProtection,
  updateExpiration
};
