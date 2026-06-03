const Click = require("../models/click.model");
const ShortUrl = require("../models/url.model");
const logger = require("../config/logger");
const { getClientIp, getUserAgent } = require("../utils/request");
const { hashValue } = require("../utils/token");

const parseUserAgent = (userAgent = "") => {
  const lower = userAgent.toLowerCase();

  const browser = lower.includes("edg/")
    ? "edge"
    : lower.includes("chrome/")
      ? "chrome"
      : lower.includes("safari/")
        ? "safari"
        : lower.includes("firefox/")
          ? "firefox"
          : "unknown";

  const os = lower.includes("windows")
    ? "windows"
    : lower.includes("mac os")
      ? "macos"
      : lower.includes("android")
        ? "android"
        : lower.includes("iphone") || lower.includes("ipad")
          ? "ios"
          : lower.includes("linux")
            ? "linux"
            : "unknown";

  const device = lower.includes("mobile")
    ? "mobile"
    : lower.includes("tablet") || lower.includes("ipad")
      ? "tablet"
      : "desktop";

  return {
    browser,
    os,
    device
  };
};

const getReferrerHost = (referrer = "") => {
  try {
    return new URL(referrer).hostname.toLowerCase() || null;
  } catch {
    return null;
  }
};

const getCountry = (req) => {
  const country = req.headers["x-country"]
    || req.headers["cf-ipcountry"]
    || req.headers["x-vercel-ip-country"]
    || "unknown";

  return typeof country === "string" ? country.toUpperCase() : "unknown";
};

const collectRedirectAnalytics = async ({ req, url }) => {
  const userAgent = getUserAgent(req);
  const parsedUserAgent = parseUserAgent(userAgent);
  const referrer = req.get("referer") || req.get("referrer") || null;

  await Promise.all([
    Click.create({
      urlId: url.id,
      userId: url.userId,
      shortCode: url.shortCode,
      ipHash: hashValue(getClientIp(req)),
      userAgent,
      referrer,
      referrerHost: getReferrerHost(referrer),
      country: getCountry(req),
      ...parsedUserAgent
    }),
    ShortUrl.updateOne(
      { _id: url.id },
      {
        $inc: { totalClicks: 1 },
        $set: { lastClickedAt: new Date() }
      }
    )
  ]);
};

const collectRedirectAnalyticsAsync = ({ req, url }) => {
  setImmediate(() => {
    collectRedirectAnalytics({ req, url }).catch((error) => {
      logger.warn({ err: error, shortCode: url.shortCode }, "Redirect analytics collection failed");
    });
  });
};

module.exports = {
  collectRedirectAnalyticsAsync
};
