const crypto = require("crypto");
const { env } = require("../config/env");
const AppError = require("../utils/app-error");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const createOAuthState = () => crypto.randomBytes(32).toString("hex");

const buildGoogleAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: env.googleCallbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account"
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

const exchangeCodeForTokens = async (code) => {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: env.googleCallbackUrl,
      grant_type: "authorization_code"
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new AppError("Google OAuth token exchange failed", 502, "GOOGLE_TOKEN_EXCHANGE_FAILED");
  }

  return payload;
};

const getGoogleProfile = async (googleAccessToken) => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`
    }
  });

  const profile = await response.json();

  if (!response.ok) {
    throw new AppError("Unable to fetch Google profile", 502, "GOOGLE_PROFILE_FETCH_FAILED");
  }

  if (!profile.email || !profile.sub) {
    throw new AppError("Google profile is missing required information", 400, "GOOGLE_PROFILE_INVALID");
  }

  return {
    googleId: profile.sub,
    email: profile.email.toLowerCase(),
    name: profile.name || profile.email.split("@")[0],
    avatarUrl: profile.picture || null,
    isEmailVerified: Boolean(profile.email_verified)
  };
};

module.exports = {
  createOAuthState,
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  getGoogleProfile
};
