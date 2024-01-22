const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          console.log(value);
          if (value.trim().includes(" ")) {
            return false;
          }
        },
        message: "Remove space between username",
      },
      lowercase: true,
      require: [true, "A unique user name is require"],
      max: 25,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      require: [true, "Please provide a email"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    name: {
      type: String,
      require: [true, "A user must have a good name"],
    },

    totalClaps: {
      type: Number,
      default: 0,
    },

    password: {
      type: String,
      select: false,
      require: [true, "A user must need a secure password"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordExpiresIn: Date,

    confirmPassowrd: {
      type: String,
      validate: {
        validator: (pass) => this.password === pass,
        message: "Confirm password did not match",
      },

      following: [mongoose.Types.ObjectId],

      profileImage: String,

      coverImage: String,

      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
// instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Populating follower
userSchema.virtual("totalFollowers", {
  ref: "Follower",
  localField: "_id",
  foreignField: "followsTo",
  count: true,
});

userSchema.virtual("followers", {
  ref: "Follower",
  localField: "_id",
  foreignField: "followsTo",
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "totalFollowers",
  });
  next();
});

// creating password reset token
userSchema.methods.createResetToken = function () {
  // creating random string
  const resetToken = crypto.randomBytes(32).toString("hex");
  // storing the encrypted token to database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 10 minute expires time from when it's generated

  this.passwordExpiresIn = Date.now() + 10 * 1000;
  // sending the plain to token to user
  return resetToken;
};

// Virtual Populating based on referencing to the blog resource
userSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "user",
});

// Encrypting password before savin the document into database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log(this.isModified("password"));
  const encryptedPassword = await bcrypt.hash(this.password, 12);
  console.log(encryptedPassword);
  this.password = encryptedPassword;
  this.confirmPassowrd = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  console.log("changed password");
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
