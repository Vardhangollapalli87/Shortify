const { env } = require("../config/env");
const { getRedisClient } = require("../config/redis");
const logger = require("../config/logger");

const keyForShortCode = (shortCode) => `shortify:redirect:${shortCode}`;

const getRedirectCache = async (shortCode) => {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  try {
    const value = await redis.get(keyForShortCode(shortCode));
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.warn({ err: error, shortCode }, "Redirect cache read failed");
    return null;
  }
};

const setRedirectCache = async (shortCode, payload) => {
  const redis = getRedisClient();

  if (!redis || payload.isPasswordProtected) {
    return;
  }

  try {
    await redis.set(keyForShortCode(shortCode), JSON.stringify(payload), "EX", env.redirectCacheTtlSeconds);
  } catch (error) {
    logger.warn({ err: error, shortCode }, "Redirect cache write failed");
  }
};

const deleteRedirectCache = async (shortCode) => {
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  try {
    await redis.del(keyForShortCode(shortCode));
  } catch (error) {
    logger.warn({ err: error, shortCode }, "Redirect cache delete failed");
  }
};

module.exports = {
  getRedirectCache,
  setRedirectCache,
  deleteRedirectCache
};
