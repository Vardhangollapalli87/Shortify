const http = require("http");
const app = require("./app");
const { env, validateEnv } = require("./config/env");
const { connectDatabase, closeDatabase } = require("./config/database");
const { closeRedis, connectRedis } = require("./config/redis");
const logger = require("./config/logger");

let server;

const shutdown = async (signal) => {
  logger.info({ signal }, "Shutdown signal received");

  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed");
      await closeRedis();
      await closeDatabase();
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000).unref();
  }
};

const startServer = async () => {
  validateEnv();
  await connectDatabase();
  await connectRedis();

  server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Shortify API listening on port ${env.port}`);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught exception");
  process.exit(1);
});

startServer().catch((error) => {
  logger.fatal({ err: error }, "Failed to start Shortify API");
  process.exit(1);
});
