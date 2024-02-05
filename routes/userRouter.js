const express = require("express");

const userController = require("../controller/userController");
const authController = require("../controller/authController");
const followerRouter = require("../routes/followerRoutes");
const bodyParser = require("body-parser");

const router = express.Router();
const middle = bodyParser.json({ type: "application/*" });

router.get("/", userController.getAllUser);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authController.protect, userController.getMe);
router.patch(
  "/updateProfile",
  authController.protect,
  userController.upload,
  userController.resizePhoto,
  userController.updateProfile
);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:resetToken", authController.resetPassword);

router.get(
  "/me/followers",
  authController.protect,
  userController.getAllFollower
);
router.get("/:userId", authController.protect, userController.getUser);
router.use("/:userId/followers", followerRouter);
module.exports = router;
