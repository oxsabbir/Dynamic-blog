const { Router } = require("express");

const commentController = require("../controller/commentController");
const authController = require("../controller/authController");

const router = Router({ mergeParams: true });

router.post("/", authController.protect, commentController.addNewComment);

router
  .route("/:commentId")
  .get(commentController.getComment)
  .post(authController.protect, commentController.replyToComment)
  .delete(authController.protect, commentController.deleteComment)
  .patch(authController.protect, commentController.updateComment);

module.exports = router;
