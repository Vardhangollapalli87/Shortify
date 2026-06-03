const express = require("express");
const authRoutes = require("./auth.routes");
const healthRoutes = require("./health.routes");
const analyticsRoutes = require("./analytics.routes");
const urlRoutes = require("./url.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/urls", urlRoutes);

module.exports = router;
