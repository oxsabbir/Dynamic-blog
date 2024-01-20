const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

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

  // checking if user changed password after the token has been issued
  if (
    userInfo.passwordChangedAt &&
    userInfo.passwordChangedAt.getTime() > decoded.iat * 1000
  )
    return next(
      new AppError(
        "Password has been changed recently. Please login again to gain access",
        401
      )
    );

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
  const token = createJwtToken(userInfo._id);

  sendToken(res, token);
});

exports.updatePassword = asyncHandler(async function (req, res, next) {
  // chekcing if user provided all the information
  if (
    !req.body.currentPassword ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return next(
      new AppError("Please provide current password and a new password")
    );
  }

  const mainUser = await User.findOne({ _id: req.user._id }).select(
    "+password"
  );

  // checking if password is correct
  const isPasswordCorrect = await mainUser.correctPassword(
    req.body.currentPassword,
    mainUser.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError("Current password invalid try again"), 401);
  }
  const isBothPassSame = await mainUser.correctPassword(
    req.body.password,
    mainUser.password
  );
  if (isBothPassSame)
    return next(
      new AppError("Current password and new password cannot be same", 400)
    );

  // updating the password
  mainUser.password = req.body.password;
  mainUser.confirmPassowrd = req.body.confirmPassowrd;

  await mainUser.save();

  // generatin new token
  const token = createJwtToken(mainUser._id);
  sendToken(res, token);
});

exports.forgotPassword = asyncHandler(async function (req, res, next) {
  if (!req.body.email)
    return next(new AppError("Please provide an email to reset password", 400));

  const mainUser = await User.findOne({ email: req.body.email });
  if (!mainUser)
    return next(new AppError("No user belongs to this email", 404));

  // now generating the token and saving it to database
  const token = mainUser.createResetToken();
  // saving here because we've only set the token value to the doucment not in database that's why by using save we need to store data to the database
  await mainUser.save();

  res.status(200).json({
    status: "success",
    data: {
      resetToken: token,
    },
  });

  next();
});

exports.resetPassword = asyncHandler(async function (req, res, next) {
  const { resetToken } = req.params;
  // checking if token if valid
  if (!resetToken) return next("Please provide reset token", 400);

  // encrypting once again to compare with the database

  const encryptedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const mainUser = await User.findOne({
    passwordResetToken: encryptedToken,
    passwordExpiresIn: { $gte: Date.now() },
  });

  if (!mainUser)
    return next(
      new AppError("Invalid password reset token, try to get a new one", 400)
    );
  // changing the password
  if (!req.body.password)
    return next(new AppError("You must provide a new password", 400));

  mainUser.password = req.body.password;
  mainUser.passwordExpiresIn = undefined;
  mainUser.passwordResetToken = undefined;

  await mainUser.save();
  // creating new token
  const token = createJwtToken(mainUser._id);
  sendToken(res, token);
});
