const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "A blog must have a title"],
  },
  content: {
    type: String,
    require: [true, "A blog must have some content"],
  },
  claps: Number,

  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// virtual populate

blogSchema.virtual("commnets", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
