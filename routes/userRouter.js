const express = require("express");

const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:resetToken", authController.resetPassword);

router.get("/me", authController.protect, userController.getMe);

module.exports = router;
