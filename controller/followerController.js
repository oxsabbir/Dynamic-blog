const asyncHandler = require("../utils/asyncHandler");

const Follower = require("../model/followerModel");
const AppError = require("../utils/AppError");

exports.follow = asyncHandler(async function (req, res, next) {
  req.body.followsTo = req.body.followsTo || req.params.userId;
  req.body.userId = req.body.userId || req.user._id;
  if (req.params.userId === req.user._id.toString())
    return next(new AppError("Cannot follow yourself", 400));

  const follower = await Follower.create(req.body);

  res.status(201).json({
    status: "succes",
    data: {
      follower,
    },
  });
});

exports.unfollow = asyncHandler(async function (req, res, next) {
  const userId = req.body.userId || req.params.userId;
  console.log(userId);
  const unfollowed = await Follower.deleteOne({ followsTo: userId });
  res.status(204).json({
    status: "success",
    data: {
      user: unfollowed,
    },
  });
});
