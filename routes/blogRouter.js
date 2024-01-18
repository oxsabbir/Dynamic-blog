const { Router } = require("express");
const blogController = require("../controller/blogController");
const authController = require("../controller/authController");

const router = Router();

router
  .route("/")
  .get(authController.protect, blogController.getAllBlog)
  .post(blogController.createNewBlog);

module.exports = router;
