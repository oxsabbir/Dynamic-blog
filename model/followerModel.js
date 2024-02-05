const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

followerSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "userId",
});

followerSchema.pre(/^find/, function (next) {
  this.populate({ path: "user" });
  next();
});

// followerSchema.index({ followsTo: 1, userId: 1 }, { unique: true });

const followerModel = mongoose.model("Follower", followerSchema);

module.exports = followerModel;
