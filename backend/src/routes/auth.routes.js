const express = require("express");
const authController = require("../controllers/auth.controller");
const { authorize, protect } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants/auth.constants");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/google", authController.startGoogleOAuth);
router.get("/google/callback", authController.googleOAuthCallback);

router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.get("/admin-check", protect, authorize(USER_ROLES.ADMIN), authController.getMe);

module.exports = router;
