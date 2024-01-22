const User = require("../model/userModel");
const asyncHandler = require("../utils/asyncHandler");

exports.getUser = asyncHandler(async function (req, res, next) {
  const userData = await User.findById(req.params.userId);
  res.status(200).json({
    status: "success",
    data: {
      user: userData,
    },
  });
});
exports.getAllUser = asyncHandler(async function (req, res, next) {
  const allUser = await User.find();
  res.status(200).json({
    status: "success",
    result: allUser.length,
    data: {
      user: allUser,
    },
  });
});

exports.getMe = asyncHandler(async function (req, res, next) {
  const user = await User.findOne({ _id: req.user._id }).populate("blogs");
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAllFollower = asyncHandler(async function (req, res, next) {
  const userId = req.params.userId;
  console.log(userId);
  const { followers } = await User.findOne({
    _id: userId || req.user._id,
  }).populate({
    path: "followers",
    strictPopulate: false,
  });
  res.status(200).json({
    status: "success",
    data: {
      followers,
    },
  });
});
