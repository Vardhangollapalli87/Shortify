const catchAsync = require("../utils/catch-async");
const sendResponse = require("../utils/send-response");
const urlService = require("../services/url.service");

const createUrl = catchAsync(async (req, res) => {
  const data = await urlService.createUrl({
    userId: req.user._id,
    ...req.body
  });

  return sendResponse(res, 201, data, "Short link created successfully");
});

const getUrls = catchAsync(async (req, res) => {
  const data = await urlService.getUrls({ userId: req.user._id });

  return sendResponse(res, 200, data, "Short links retrieved successfully");
});

const getUrl = catchAsync(async (req, res) => {
  const data = await urlService.getUrl({ userId: req.user._id, urlId: req.params.urlId });

  return sendResponse(res, 200, data, "Short link retrieved successfully");
});

const updateUrl = catchAsync(async (req, res) => {
  const data = await urlService.updateUrl({
    userId: req.user._id,
    urlId: req.params.urlId,
    updates: req.body
  });

  return sendResponse(res, 200, data, "Short link updated successfully");
});

const deleteUrl = catchAsync(async (req, res) => {
  const data = await urlService.deleteUrl({ userId: req.user._id, urlId: req.params.urlId });

  return sendResponse(res, 200, data, "Short link deleted successfully");
});

const toggleUrl = catchAsync(async (req, res) => {
  const data = await urlService.toggleUrl({ userId: req.user._id, urlId: req.params.urlId });

  return sendResponse(res, 200, data, "Short link status updated successfully");
});

const updatePasswordProtection = catchAsync(async (req, res) => {
  const data = await urlService.updatePasswordProtection({
    userId: req.user._id,
    urlId: req.params.urlId,
    password: req.body.password
  });

  return sendResponse(res, 200, data, "Password protection updated successfully");
});

const updateExpiration = catchAsync(async (req, res) => {
  const data = await urlService.updateExpiration({
    userId: req.user._id,
    urlId: req.params.urlId,
    expiresAt: req.body.expiresAt
  });

  return sendResponse(res, 200, data, "Expiration updated successfully");
});

module.exports = {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  toggleUrl,
  updatePasswordProtection,
  updateExpiration
};
