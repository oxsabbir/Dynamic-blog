const { Router } = require("express");

const authController = require("../controller/authController");
const userController = require("../controller/userController");
const followerController = require("../controller/followerController");

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(authController.protect, followerController.follow)
  .delete(authController.protect, followerController.unfollow)
  .get(userController.getAllFollower);

module.exports = router;
