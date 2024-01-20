const User = require("../model/userModel");
const asyncHandler = require("../utils/asyncHandler");

exports.getUser = function (req, res, next) {};

exports.getMe = asyncHandler(async function (req, res, next) {
  const user = await User.findOne({ _id: req.user._id }).populate("blogs");
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
