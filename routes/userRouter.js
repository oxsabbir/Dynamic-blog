const express = require("express");

const userController = require("../controller/userController");
const authController = require("../controller/authController");
const followerRouter = require("../routes/followerRoutes");

const router = express.Router();

router.get("/", userController.getAllUser);
router.get("/me", authController.protect, userController.getMe);
router.get("/:userId", userController.getUser);
router.use("/:userId/followers", followerRouter);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
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
module.exports = router;
