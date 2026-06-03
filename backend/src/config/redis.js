const { env } = require("./env");
const logger = require("./logger");
const Redis = require("ioredis");

let redisClient = null;
let redisStatus = env.redisUrl ? "not_initialized" : "disabled";

const connectRedis = async () => {
  if (!env.redisUrl) {
    redisStatus = "disabled";
    logger.info("Redis URL not configured. Redirect cache disabled.");
    return null;
  }

  redisClient = new Redis(env.redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: 10000,
    commandTimeout: 1000,
    retryStrategy: (times) => Math.min(times * 100, 2000),
    reconnectOnError: (error) => {
      const message = error.message.toLowerCase();
      return message.includes("readonly") || message.includes("connection");
    }
  });

  redisClient.on("error", (error) => {
    redisStatus = "error";
    logger.warn({ err: error }, "Redis connection error");
  });

  redisClient.on("connect", () => {
    redisStatus = "connecting";
  });

  redisClient.on("ready", () => {
    redisStatus = "connected";
    logger.info("Redis connection established");
  });

  redisClient.on("close", () => {
    redisStatus = "disconnected";
  });

  try {
    await redisClient.connect();
  } catch (error) {
    redisStatus = "unavailable";
    logger.warn({ err: error }, "Redis unavailable. Continuing without redirect cache.");
  }

  return redisClient;
};

const getRedisClient = () => {
  if (!redisClient || redisClient.status !== "ready") {
    return null;
  }

  return redisClient;
};

const closeRedis = async () => {
  if (redisClient && redisClient.status !== "end") {
    await redisClient.quit();
    redisStatus = "closed";
    logger.info("Redis connection closed");
  }
};

const getRedisHealth = () => ({
  status: redisStatus,
  enabled: Boolean(env.redisUrl),
  ready: Boolean(redisClient && redisClient.status === "ready")
});

module.exports = {
  connectRedis,
  closeRedis,
  getRedisClient,
  getRedisHealth
};
