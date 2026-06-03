const mongoose = require("mongoose");
const Click = require("../models/click.model");
const MAX_ANALYTICS_RANGE_DAYS = 365;
const ShortUrl = require("../models/url.model");
const logger = require("../config/logger");
const AppError = require("../utils/app-error");
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

const validateUrlId = (urlId) => {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    throw new AppError("Invalid resource identifier", 400, "INVALID_IDENTIFIER");
  }
};

const validateDateRange = ({ startDate, endDate }) => {
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("Invalid date range", 400, "INVALID_DATE_RANGE");
  }

  if (start > end) {
    throw new AppError("Start date cannot be after end date", 400, "INVALID_DATE_RANGE");
  }

  const diffInDays = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);

  if (diffInDays > MAX_ANALYTICS_RANGE_DAYS) {
    throw new AppError("Date range exceeds the maximum allowed period", 400, "DATE_RANGE_EXCEEDED");
  }

  return { start, end };
};

const ensureOwnedUrl = async ({ userId, urlId }) => {
  validateUrlId(urlId);

  const url = await ShortUrl.findOne({ _id: urlId, userId }).lean();

  if (!url) {
    throw new AppError("You do not have access to this short link", 404, "LINK_NOT_FOUND");
  }

  return url;
};

const getOverviewAnalytics = async ({ userId }) => {
  const [totalLinks, clicksSummary, topLink] = await Promise.all([
    ShortUrl.countDocuments({ userId }),
    Click.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$ipHash" }
        }
      },
      {
        $project: {
          _id: 0,
          totalClicks: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" }
        }
      }
    ]),
    ShortUrl.find({ userId }).sort({ totalClicks: -1, lastClickedAt: -1 }).limit(1).lean()
  ]);

  const summary = clicksSummary[0] || { totalClicks: 0, uniqueVisitors: 0 };

  return {
    totalLinks,
    totalClicks: summary.totalClicks,
    uniqueVisitors: summary.uniqueVisitors,
    topLink: topLink[0]
      ? {
          id: topLink[0]._id.toString(),
          shortCode: topLink[0].shortCode,
          originalUrl: topLink[0].originalUrl,
          totalClicks: topLink[0].totalClicks || 0
        }
      : null
  };
};

const getTopLinksAnalytics = async ({ userId }) => {
  const links = await ShortUrl.find({ userId })
    .sort({ totalClicks: -1, lastClickedAt: -1 })
    .limit(10)
    .lean();

  return links.map((link) => ({
    id: link._id.toString(),
    shortCode: link.shortCode,
    originalUrl: link.originalUrl,
    totalClicks: link.totalClicks || 0
  }));
};

const getUrlSummaryAnalytics = async ({ userId, urlId }) => {
  await ensureOwnedUrl({ userId, urlId });

  const [summary] = await Click.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), urlId: new mongoose.Types.ObjectId(urlId) } },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$ipHash" },
        lastClickedAt: { $max: "$clickedAt" }
      }
    },
    {
      $project: {
        _id: 0,
        totalClicks: 1,
        uniqueVisitors: { $size: "$uniqueVisitors" },
        lastClickedAt: 1
      }
    }
  ]);

  return summary || { totalClicks: 0, uniqueVisitors: 0, lastClickedAt: null };
};

const getUrlTimeseriesAnalytics = async ({ userId, urlId, startDate, endDate }) => {
  await ensureOwnedUrl({ userId, urlId });

  const { start, end } = validateDateRange({ startDate, endDate });

  const data = await Click.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        urlId: new mongoose.Types.ObjectId(urlId),
        clickedAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1
      }
    }
  ]);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    interval: "day",
    data
  };
};

const getUrlBreakdownAnalytics = async ({ userId, urlId, fieldName }) => {
  await ensureOwnedUrl({ userId, urlId });

  const allowedFields = new Set(["browser", "device", "os", "referrerHost", "country"]);

  if (!allowedFields.has(fieldName)) {
    throw new AppError("Unsupported analytics breakdown", 400, "INVALID_BREAKDOWN_FIELD");
  }

  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        urlId: new mongoose.Types.ObjectId(urlId)
      }
    },
    {
      $group: {
        _id: `$${fieldName}`,
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1, _id: 1 } }
  ];

  const rows = await Click.aggregate(pipeline);
  const total = rows.reduce((sum, entry) => sum + entry.count, 0);

  return rows.map((entry) => ({
    value: entry._id || "unknown",
    count: entry.count,
    percentage: total > 0 ? Number(((entry.count / total) * 100).toFixed(1)) : 0
  }));
};

module.exports = {
  collectRedirectAnalyticsAsync,
  getOverviewAnalytics,
  getTopLinksAnalytics,
  getUrlSummaryAnalytics,
  getUrlTimeseriesAnalytics,
  getUrlBreakdownAnalytics
};
