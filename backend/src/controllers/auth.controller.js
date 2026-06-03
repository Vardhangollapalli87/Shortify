const { env } = require("../config/env");
const authService = require("../services/auth.service");
const {
  buildGoogleAuthUrl,
  createOAuthState
} = require("../services/google-oauth.service");
const catchAsync = require("../utils/catch-async");
const sendResponse = require("../utils/send-response");
const { durationToMilliseconds } = require("../utils/token");
const {
  validateForgotPasswordPayload,
  validateLoginPayload,
  validateRegisterPayload,
  validateResetPasswordPayload
} = require("../validators/auth.validator");

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  domain: env.cookieDomain,
  path: "/api/v1/auth",
  maxAge: durationToMilliseconds(env.jwtRefreshExpiresIn)
});

const getGoogleStateCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  domain: env.cookieDomain,
  path: "/api/v1/auth/google",
  maxAge: 10 * 60 * 1000
});

const appendQueryParam = (url, key, value) => {
  const redirectUrl = new URL(url);
  redirectUrl.searchParams.set(key, value);
  return redirectUrl.toString();
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(env.refreshTokenCookieName, refreshToken, getRefreshCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(env.refreshTokenCookieName, getRefreshCookieOptions());
};

const startGoogleOAuth = (_req, res) => {
  const state = createOAuthState();

  res.cookie(env.googleOAuthStateCookieName, state, getGoogleStateCookieOptions());

  return res.redirect(302, buildGoogleAuthUrl(state));
};

const googleOAuthCallback = async (req, res) => {
  const { code, state, error } = req.query;
  const storedState = req.cookies[env.googleOAuthStateCookieName];

  res.clearCookie(env.googleOAuthStateCookieName, getGoogleStateCookieOptions());

  if (error) {
    return res.redirect(302, appendQueryParam(env.clientOAuthFailureUrl, "error", "google_oauth_denied"));
  }

  if (!code || !state || !storedState || state !== storedState) {
    return res.redirect(302, appendQueryParam(env.clientOAuthFailureUrl, "error", "invalid_oauth_state"));
  }

  try {
    const result = await authService.authenticateWithGoogle({ code, req });

    setRefreshTokenCookie(res, result.refreshToken);

    return res.redirect(302, appendQueryParam(env.clientOAuthSuccessUrl, "provider", "google"));
  } catch (callbackError) {
    req.log.error({ err: callbackError }, "Google OAuth callback failed");
    return res.redirect(302, appendQueryParam(env.clientOAuthFailureUrl, "error", "google_oauth_failed"));
  }
};

const register = catchAsync(async (req, res) => {
  const payload = validateRegisterPayload(req.body);
  const result = await authService.register({ ...payload, req });

  setRefreshTokenCookie(res, result.refreshToken);

  return sendResponse(
    res,
    201,
    {
      user: result.user,
      accessToken: result.accessToken
    },
    "Account created successfully"
  );
});

const login = catchAsync(async (req, res) => {
  const payload = validateLoginPayload(req.body);
  const result = await authService.login({ ...payload, req });

  setRefreshTokenCookie(res, result.refreshToken);

  return sendResponse(
    res,
    200,
    {
      user: result.user,
      accessToken: result.accessToken
    },
    "Logged in successfully"
  );
});

const refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies[env.refreshTokenCookieName];
  const result = await authService.refresh({ refreshToken, req });

  setRefreshTokenCookie(res, result.refreshToken);

  return sendResponse(
    res,
    200,
    {
      user: result.user,
      accessToken: result.accessToken
    },
    "Token refreshed successfully"
  );
});

const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies[env.refreshTokenCookieName];
  await authService.logout(refreshToken);
  clearRefreshTokenCookie(res);

  return sendResponse(res, 200, null, "Logged out successfully");
});

const getMe = catchAsync(async (req, res) => sendResponse(res, 200, { user: req.user.toSafeObject() }));

const forgotPassword = catchAsync(async (req, res) => {
  const payload = validateForgotPasswordPayload(req.body);
  await authService.forgotPassword(payload);

  return sendResponse(
    res,
    200,
    null,
    "If an account exists for this email, a password reset link has been sent"
  );
});

const resetPassword = catchAsync(async (req, res) => {
  const payload = validateResetPasswordPayload(req.body);
  const result = await authService.resetPassword(payload);

  return sendResponse(res, 200, result, "Password reset successfully");
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  startGoogleOAuth,
  googleOAuthCallback
};
