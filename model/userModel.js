const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    require: [true, "A unique user name is require"],
    max: 25,
  },
  name: {
    type: String,
    require: [true, "A user must have a good name"],
  },
  totalClaps: Number,
  password: String,

  confirmPassowrd: {
    type: Stirng,
    validate: {
      validator: (pass) => this.password === pass,
      message: "Confirm password did not match",
    },
    follower: [mongoose.Types.ObjectId],
    following: [mongoose.Types.ObjectId],

    profileImage: Stirng,

    coverImage: Stirng,

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
