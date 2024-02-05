const Follower = require("../model/followerModel");
const User = require("../model/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const multer = require("multer");

const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image please upload an image", 400));
  }
};

// initializing a upload object
const upload = multer({
  storage: multerStorage,
  fileFilter,
});

// getting the file from memory buffer and resize and upoload it to the server
exports.resizePhoto = asyncHandler(async function (req, res, next) {
  if (!req.files) return next();
  const size = { height: 500, width: 500 };
  Object.keys(req.files).map(async (item) => {
    if (item === "coverImage") {
      size.height = 1333;
      size.width = 2000;
    }

    req.files[item][0].filename = `user-${item}-${
      req.user._id
    }-${Date.now()}.jpeg`;
    await sharp(req.files[item][0].buffer)
      .resize(size.width, size.height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.files[item][0].filename}`);
  });
  next();
});
// getting the file from the form  and uploading to memory buffer
exports.upload = upload.fields([
  {
    name: "photo",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
]);

exports.getUser = asyncHandler(async function (req, res, next) {
  const isfollowed = await Follower.findOne({
    followsTo: req.params.userId,
    userId: req.user._id,
  });
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
  console.log(allUser);
  res.status(200).json({
    status: "success",
    result: allUser.length,
    data: {
      user: allUser,
    },
  });
});

const profileFilter = function (body, ...allowed) {
  const temp = {};
  Object.keys(body).map((el) => {
    if (allowed.includes(el)) {
      temp[el] = body[el];
    }
  });
  return temp;
};

exports.updateProfile = asyncHandler(async function (req, res, next) {
  if (req.files) {
    Object.keys(req.files).map(
      (item) => (req.body[item] = req.files[item][0].filename)
    );
  }
  const bodydata = profileFilter(
    req.body,
    "userName",
    "name",
    "email",
    "photo",
    "coverImage"
  );

  const userData = await User.findByIdAndUpdate(req.user._id, bodydata, {
    runValidators: false,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: userData,
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
