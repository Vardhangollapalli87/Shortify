const mongoose = require("mongoose");
const { env } = require("./env");
const logger = require("./logger");

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri, {
    autoIndex: env.nodeEnv !== "production",
    serverSelectionTimeoutMS: 10000
  });

  logger.info("MongoDB connection established");
};

const closeDatabase = async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
};

const getDatabaseHealth = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  return {
    status: states[mongoose.connection.readyState] || "unknown",
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name || null,
    host: mongoose.connection.host || null
  };
};

module.exports = {
  connectDatabase,
  closeDatabase,
  getDatabaseHealth
};
