const { collectRedirectAnalyticsAsync } = require("../services/analytics.service");
const { env } = require("../config/env");
const { resolveRedirect } = require("../services/redirect.service");
const catchAsync = require("../utils/catch-async");

const getPasswordChallengeUrl = ({ shortCode, errorCode }) => {
  const challengeUrl = new URL(`/links/password/${encodeURIComponent(shortCode)}`, env.clientUrl);

  if (errorCode) {
    challengeUrl.searchParams.set("error", errorCode);
  }

  return challengeUrl.toString();
};

const redirectToOriginalUrl = catchAsync(async (req, res) => {
  let redirect;

  try {
    redirect = await resolveRedirect({
      shortCode: req.params.shortCode,
      req
    });
  } catch (error) {
    if (error.code === "LINK_PASSWORD_REQUIRED" || error.code === "LINK_PASSWORD_INVALID") {
      return res.redirect(302, getPasswordChallengeUrl({
        shortCode: req.params.shortCode,
        errorCode: error.code === "LINK_PASSWORD_INVALID" ? "invalid_password" : null
      }));
    }

    throw error;
  }

  collectRedirectAnalyticsAsync({
    req,
    url: redirect
  });

  res.setHeader("Cache-Control", "no-store");
  return res.redirect(302, redirect.originalUrl);
});

module.exports = {
  redirectToOriginalUrl
};
