const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");

const createJwtToken = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
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
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    HttpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOption.secure = true;
  }

  res.cookie("jwt", token, cookieOption);
  res.status(201).json(option);
};

exports.protect = asyncHandler(async function (req, res, next) {
  // get the token and get the hidden data of user id
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return next(new AppError("Please login to gain access"));
  }
  // check if user exist or not
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userInfo = await User.findOne({ _id: decoded.id });
  console.log(decoded);

  if (!userInfo)
    return next(new AppError("There is no belongs to this token", 404));
  // check if the token expires of not
  if (Date.now() > new Date(decoded.exp * 1000))
    return next(new AppError("Token has been expires"));
  // check if user changed after token was register
  // finally grant access to private resource
  req.user = userInfo;
  next();
});

exports.signup = asyncHandler(async function (req, res, next) {
  console.log(req.body);
  const newUser = await User.create(req.body);
  if (!createJwtToken)
    return next(
      new AppError("Something went wrong. cannot create new user", 500)
    );

  const token = createJwtToken(newUser._id);
  console.log(newUser);
  sendToken(res, token, newUser);
});

exports.login = asyncHandler(async function (req, res, next) {
  // get email password from the body
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));
  // check if user exist
  const userInfo = await User.findOne({ email }).select("+password");

  // check if the password is correct

  if (
    !userInfo ||
    !(await userInfo.correctPassword(password, userInfo.password))
  )
    return next(
      new AppError("Please provide a correct combination of email and password")
    );

  // grant access and send token
  console.log(userInfo._id);
  const token = createJwtToken(userInfo._id);

  sendToken(res, token);
});
