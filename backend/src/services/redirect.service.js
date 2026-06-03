const bcrypt = require("bcrypt");
const ShortUrl = require("../models/url.model");
const AppError = require("../utils/app-error");
const { getRedirectCache, setRedirectCache } = require("./cache.service");

const RESERVED_SHORT_CODES = new Set([
  "api",
  "auth",
  "dashboard",
  "login",
  "register",
  "health",
  "favicon.ico"
]);

const toRedirectPayload = (url) => ({
  id: url._id.toString(),
  userId: url.userId.toString(),
  originalUrl: url.originalUrl,
  shortCode: url.shortCode,
  isActive: url.isActive,
  expiresAt: url.expiresAt ? url.expiresAt.toISOString() : null,
  isPasswordProtected: Boolean(url.passwordHash)
});

const isExpired = (payload) => payload.expiresAt && new Date(payload.expiresAt).getTime() <= Date.now();

const getSubmittedPassword = (req) => req.get("x-link-password") || req.query.password || null;

const getUrlFromMongo = async (shortCode) => ShortUrl.findOne({ shortCode }).select("+passwordHash");

const resolveRedirect = async ({ shortCode, req }) => {
  if (!shortCode || RESERVED_SHORT_CODES.has(shortCode.toLowerCase())) {
    throw new AppError("Short link not found", 404, "LINK_NOT_FOUND");
  }

  const submittedPassword = getSubmittedPassword(req);
  let payload = !submittedPassword ? await getRedirectCache(shortCode) : null;
  let urlDocument = null;

  if (!payload) {
    urlDocument = await getUrlFromMongo(shortCode);

    if (!urlDocument) {
      throw new AppError("Short link not found", 404, "LINK_NOT_FOUND");
    }

    payload = toRedirectPayload(urlDocument);
    await setRedirectCache(shortCode, payload);
  }

  if (!payload.isActive) {
    throw new AppError("This short link is disabled", 404, "LINK_DISABLED");
  }

  if (isExpired(payload)) {
    throw new AppError("This short link has expired", 410, "LINK_EXPIRED");
  }

  if (payload.isPasswordProtected) {
    if (!submittedPassword) {
      throw new AppError("This short link requires a password", 401, "LINK_PASSWORD_REQUIRED");
    }

    if (!urlDocument || !urlDocument.passwordHash) {
      urlDocument = await getUrlFromMongo(shortCode);
    }

    const isPasswordValid = urlDocument && await bcrypt.compare(submittedPassword, urlDocument.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid link password", 403, "LINK_PASSWORD_INVALID");
    }
  }

  return payload;
};

module.exports = {
  resolveRedirect
};
