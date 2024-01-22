const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "A comment is require"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      require: [true, "A comment must have a user"],
      ref: "User",
    },
    blog: {
      type: mongoose.Types.ObjectId,
      require: [true, "A comment must have a blog"],
      ref: "Blog",
    },
    likes: Number,

    commentId: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.virtual("reply", {
  ref: "Comment",
  localField: "_id",
  foreignField: "commentId",
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name userName",
  }).populate({
    path: "reply",
  });
  next();
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
