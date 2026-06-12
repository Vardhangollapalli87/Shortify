const { env } = require("../config/env");
const logger = require("../config/logger");
const AppError = require("../utils/app-error");

const RESEND_EMAILS_URL = "https://api.resend.com/emails";

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const buildUrlWithToken = (baseUrl, token) => {
  const url = new URL(baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!env.resendApiKey || !env.emailFrom) {
    if (env.nodeEnv === "production") {
      throw new AppError("Email delivery is not configured", 500, "EMAIL_DELIVERY_NOT_CONFIGURED");
    }

    logger.info({ to, subject }, "Transactional email prepared");
    return { queued: true, provider: "logger" };
  }

  const response = await fetch(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to,
      subject,
      html,
      text
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    logger.error({ status: response.status, payload }, "Resend email delivery failed");
    throw new AppError("Email delivery failed", 502, "EMAIL_DELIVERY_FAILED");
  }

  logger.info({ to, subject, providerId: payload.id }, "Transactional email queued");
  return { queued: true, provider: "resend", id: payload.id };
};

const sendVerificationEmail = async ({ email, name, verificationToken }) => {
  const verifyUrl = buildUrlWithToken(env.clientVerifyEmailUrl, verificationToken);
  const safeName = escapeHtml(name);

  return sendEmail({
    to: email,
    subject: "Verify your Shortify email",
    text: `Hi ${name}, verify your Shortify account: ${verifyUrl}`,
    html: `
      <p>Hi ${safeName},</p>
      <p>Verify your Shortify account to finish securing your workspace.</p>
      <p><a href="${verifyUrl}">Verify email</a></p>
      <p>This link expires in ${env.emailVerificationTokenExpiresMinutes} minutes.</p>
    `
  });
};

const sendWelcomeEmail = async ({ email, name }) => {
  const safeName = escapeHtml(name);

  return sendEmail({
    to: email,
    subject: "Welcome to Shortify",
    text: `Hi ${name}, welcome to Shortify. Your email is verified and your workspace is ready.`,
    html: `
      <p>Hi ${safeName},</p>
      <p>Welcome to Shortify. Your email is verified and your workspace is ready.</p>
    `
  });
};

const sendPasswordResetEmail = async ({ email, name, resetToken }) => {
  const resetUrl = buildUrlWithToken(env.clientPasswordResetUrl, resetToken);
  const safeName = escapeHtml(name);

  return sendEmail({
    to: email,
    subject: "Reset your Shortify password",
    text: `Hi ${name}, reset your Shortify password: ${resetUrl}`,
    html: `
      <p>Hi ${safeName},</p>
      <p>Use the link below to reset your Shortify password.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>This link expires in ${env.passwordResetTokenExpiresMinutes} minutes.</p>
    `
  });
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
