const { Router } = require("express");
const blogController = require("../controller/blogController");

const router = Router();

router
  .route("/")
  .get(blogController.getAllBlog)
  .post(blogController.createNewBlog);

module.exports = router;
