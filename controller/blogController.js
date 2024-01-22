const Blog = require("../model/blogModel");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllBlog = asyncHandler(async function (req, res, next) {
  const blog = await Blog.find();

  res.status(200).json({
    status: "success",
    result: blog.length,
    data: {
      blog,
    },
  });
});

exports.getBlog = asyncHandler(async function (req, res, next) {
  const blogId = req.params?.id;
  console.log(blogId);
  const blog = await Blog.findById(blogId).populate({
    path: "commnets",
    options: { strictPopulate: false },
  });
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = asyncHandler(async function (req, res, next) {
  const blogId = req.params?.id;
  const updatedData = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      blog: updatedBlog,
    },
  });
});

exports.deleteBlog = asyncHandler(async function (req, res, next) {
  const blogId = req.params?.id;
  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  res.status(204).json({
    status: "success",
    data: {
      blog: deletedBlog,
    },
  });
});
const blogFilter = function (body) {
  let temp = {};
  Object.keys(body).map((el) => {
    if (el === "user") return;
    temp[el] = body[el];
  });
  return temp;
};

exports.createNewBlog = asyncHandler(async function (req, res, next) {
  const blogData = blogFilter(req.body);
  blogData.user = req.user._id;
  console.log(req.user._id);

  console.log(blogData);
  const blog = await Blog.create(blogData);

  res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
});
