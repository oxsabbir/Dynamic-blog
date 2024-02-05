const express = require("express");
const blogRouter = require("./routes/blogRouter");
const errorController = require("./controller/errorController");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sharp = require("sharp");

const multer = require("multer");

const app = express();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, true),
});
const uploadMiddleware = upload.single("photo");
// body parser
app.use(express.json());
// cookieParser
app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`public`));

app.post("/uploadFile", uploadMiddleware, async function (req, res, next) {
  req.file.filename = `user-blog-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/blogs/${req.file.filename}`);

  res.status(200).json({
    success: 1,
    file: {
      url: `http://localhost:3000/img/blogs/${req.file.filename}`,
    },
  });
});

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/user", userRouter);
// Grobal error handling middleware

app.use(errorController);
module.exports = app;
