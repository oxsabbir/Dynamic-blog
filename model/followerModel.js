const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  followsTo: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

followerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    strictPopulate: false,
    select: "-__v -passwordChangedAt",
  });
  next();
});

const followerModel = mongoose.model("Follower", followerSchema);

module.exports = followerModel;
