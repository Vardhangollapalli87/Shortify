const express = require("express");
const urlController = require("../controllers/url.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, urlController.createUrl);
router.get("/", protect, urlController.getUrls);
router.get("/:urlId", protect, urlController.getUrl);
router.patch("/:urlId", protect, urlController.updateUrl);
router.delete("/:urlId", protect, urlController.deleteUrl);
router.patch("/:urlId/toggle", protect, urlController.toggleUrl);
router.patch("/:urlId/password", protect, urlController.updatePasswordProtection);
router.patch("/:urlId/expiration", protect, urlController.updateExpiration);

module.exports = router;
