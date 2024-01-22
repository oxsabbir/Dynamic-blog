const Comment = require("../model/commentModel");

const asyncHandler = require("../utils/asyncHandler");

exports.addNewComment = asyncHandler(async function (req, res, next) {
  req.body.user;
  const newComment = await Comment.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

exports.getComment = asyncHandler(async function (req, res, next) {
  const comment = await Comment.findById(req.params.commentId);
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.deleteComment = asyncHandler(async function (req, res, next) {
  const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
  res.status(204).json({
    status: "success",
  });
});

exports.updateComment = asyncHandler(async function (req, res, next) {
  console.log(req.params);
  const updateComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: {
      comment: updateComment,
    },
  });
});

exports.replyToComment = asyncHandler(async function (req, res, next) {
  const reply = await Comment.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      comment: reply,
    },
  });
});
