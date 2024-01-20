const { Router } = require("express");
const blogController = require("../controller/blogController");
const authController = require("../controller/authController");

const router = Router();

router
  .route("/")
  .get(authController.protect, blogController.getAllBlog)
  .post(authController.protect, blogController.createNewBlog);

router
  .route("/:id")
  .get(authController.protect, blogController.getBlog)
  .patch(authController.protect, blogController.updateBlog)
  .delete(authController.protect, blogController.deleteBlog);

module.exports = router;
