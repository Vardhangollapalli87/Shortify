const pino = require("pino");
const { env } = require("./env");

const logger = pino({
  level: env.logLevel,
  base: {
    service: "shortify-api",
    environment: env.nodeEnv
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
      "res.headers.location"
    ],
    censor: "[REDACTED]"
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

module.exports = logger;
