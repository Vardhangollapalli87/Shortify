const catchAsync = require("../utils/catch-async");
const sendResponse = require("../utils/send-response");
const analyticsService = require("../services/analytics.service");

const getOverview = catchAsync(async (req, res) => {
  const data = await analyticsService.getOverviewAnalytics({ userId: req.user._id });

  return sendResponse(res, 200, data, "Analytics overview retrieved successfully");
});

const getTopLinks = catchAsync(async (req, res) => {
  const data = await analyticsService.getTopLinksAnalytics({ userId: req.user._id });

  return sendResponse(res, 200, data, "Top links retrieved successfully");
});

const getUrlSummary = catchAsync(async (req, res) => {
  const data = await analyticsService.getUrlSummaryAnalytics({
    userId: req.user._id,
    urlId: req.params.urlId
  });

  return sendResponse(res, 200, data, "Link summary retrieved successfully");
});

const getUrlTimeseries = catchAsync(async (req, res) => {
  const data = await analyticsService.getUrlTimeseriesAnalytics({
    userId: req.user._id,
    urlId: req.params.urlId,
    startDate: req.query.startDate,
    endDate: req.query.endDate
  });

  return sendResponse(res, 200, data, "Time series analytics retrieved successfully");
});

const getUrlBreakdown = (fieldName) => catchAsync(async (req, res) => {
  const data = await analyticsService.getUrlBreakdownAnalytics({
    userId: req.user._id,
    urlId: req.params.urlId,
    fieldName
  });

  return sendResponse(res, 200, data, `${fieldName} breakdown retrieved successfully`);
});

module.exports = {
  getOverview,
  getTopLinks,
  getUrlSummary,
  getUrlTimeseries,
  getBrowsers: getUrlBreakdown("browser"),
  getDevices: getUrlBreakdown("device"),
  getOs: getUrlBreakdown("os"),
  getReferrers: getUrlBreakdown("referrerHost"),
  getCountries: getUrlBreakdown("country")
};
