const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/overview", protect, analyticsController.getOverview);
router.get("/top-links", protect, analyticsController.getTopLinks);
router.get("/urls/:urlId/summary", protect, analyticsController.getUrlSummary);
router.get("/urls/:urlId/timeseries", protect, analyticsController.getUrlTimeseries);
router.get("/urls/:urlId/browsers", protect, analyticsController.getBrowsers);
router.get("/urls/:urlId/devices", protect, analyticsController.getDevices);
router.get("/urls/:urlId/os", protect, analyticsController.getOs);
router.get("/urls/:urlId/referrers", protect, analyticsController.getReferrers);
router.get("/urls/:urlId/countries", protect, analyticsController.getCountries);

module.exports = router;
