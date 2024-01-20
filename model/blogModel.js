const mongoose = require("mongoose");

const User = require("../model/userModel");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "A blog must have a title"],
  },
  content: {
    type: String,
    require: [true, "A blog must have some content"],
  },
  claps: {
    type: Number,
    default: 0,
  },

  user: {
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

blogSchema.statics.calculateTotalClaps = async function (userId) {
  console.log(userId);
  const stats = await this.aggregate([
    {
      $match: { user: userId },
    },
    {
      $group: {
        _id: "$user",
        numberOfClaps: { $sum: "$claps" },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await User.findOneAndUpdate(
      { _id: stats[0]._id },
      { totalClaps: stats[0].numberOfClaps }
    );
  }
};

// calculating and updating the claps after the blog is saved
// here this is an document middleware that's why we can access the from here

blogSchema.post("save", function () {
  this.constructor.calculateTotalClaps(this.user._id);
});

// cloning the query for future like findoneandupdate or delete. those claps should be updated

blogSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

// now using the statics for updating the total claps when a blog is updated

// here this is an query middlware we cannot access user here
blogSchema.post(/^findOneAnd/, function () {
  this.r.constructor.calculateTotalClaps(this.r.user);
});

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
