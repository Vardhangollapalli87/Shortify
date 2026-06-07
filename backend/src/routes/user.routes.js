const express = require("express");
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/me", protect, userController.getMe);
router.patch("/me", protect, userController.updateMe);
router.patch("/change-password", protect, userController.changePassword);
router.delete("/me", protect, userController.deleteMe);

module.exports = router;
