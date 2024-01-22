const { Router } = require("express");

const blogController = require("../controller/blogController");
const authController = require("../controller/authController");
const commentRouter = require("./commentRoutes");

const router = Router();

router
  .route("/")
  .get(blogController.getAllBlog)
  .post(authController.protect, blogController.createNewBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(authController.protect, blogController.updateBlog)
  .delete(authController.protect, blogController.deleteBlog);

router.use("/:id/comments", commentRouter);

module.exports = router;
