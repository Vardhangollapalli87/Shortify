const { getDatabaseHealth } = require("../config/database");
const { getRedisHealth } = require("../config/redis");
const catchAsync = require("../utils/catch-async");
const sendResponse = require("../utils/send-response");

const getHealth = catchAsync(async (_req, res) => {
  const database = getDatabaseHealth();
  const cache = getRedisHealth();
  const isHealthy = database.status === "connected";

  return sendResponse(
    res,
    isHealthy ? 200 : 503,
    {
      service: "shortify-api",
      status: isHealthy ? "healthy" : "degraded",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database,
      cache
    },
    "Health check completed"
  );
});

module.exports = {
  getHealth
};
