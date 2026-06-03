const { collectRedirectAnalyticsAsync } = require("../services/analytics.service");
const { resolveRedirect } = require("../services/redirect.service");
const catchAsync = require("../utils/catch-async");

const redirectToOriginalUrl = catchAsync(async (req, res) => {
  const redirect = await resolveRedirect({
    shortCode: req.params.shortCode,
    req
  });

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
