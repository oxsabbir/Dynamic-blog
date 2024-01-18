const Blog = require("../model/blogModel");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllBlog = asyncHandler(async function (req, res, next) {
  const blog = await Blog.find();

  console.log(req.cookies.jwt);

  res.status(200).json({
    status: "success",
    result: blog.length,
    data: {
      blog,
    },
  });
});

exports.createNewBlog = asyncHandler(async function (req, res, next) {
  const blog = await Blog.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
});
