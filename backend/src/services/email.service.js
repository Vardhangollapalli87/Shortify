const logger = require("../config/logger");
const { env } = require("../config/env");

const sendPasswordResetEmail = async ({ email, name, resetToken }) => {
  const resetUrl = `${env.clientPasswordResetUrl}?token=${resetToken}`;

  if (env.nodeEnv !== "production") {
    logger.info({ email, name, resetUrl }, "Password reset email prepared");
  } else {
    logger.info({ email }, "Password reset email requested");
  }

  return {
    queued: true
  };
};

module.exports = {
  sendPasswordResetEmail
};
