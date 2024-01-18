const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: String,
  user: mongoose.Types.ObjectId,
  blog: mongoose.Types.ObjectId,
  likes: Number,
  reply: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
