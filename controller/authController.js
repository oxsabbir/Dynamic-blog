const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/userModel");
const jsonwebtoken = require("jsonwebtoken");

const AppError = require("../utils/AppError");

const signJWT = function (userId) {
  return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = function (res, token, user) {
  const option = {
    status: "success",
    token,
  };
  if (user) {
    option.data = {
      user,
    };
  }
  res.status(201).json(option);
};

exports.signup = asyncHandler(async function (req, res, next) {
  console.log(req.body);
  const createdUser = await User.create(req.body);
  const token = signJWT();
  sendToken(res, token, createdUser);
});

exports.login = asyncHandler(async function (req, res, next) {
  // get email password from the body
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));
  // check if user exist
  const validUser = await User.find({ email }).select("password");
  if (!validUser)
    return next(new AppError("There is no user belongs to this email", 404));

  // check if the password is correct
  const isPasswordCorrect = validUser.correctPassword(password);
  if (!isPasswordCorrect)
    return next(
      new AppError("Please provide a correct combination of email and password")
    );

  // grant access and send token
  const token = signJWT();

  sendToken(res, token);
});
