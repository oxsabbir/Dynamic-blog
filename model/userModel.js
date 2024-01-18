const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

    confirmPassowrd: {
      type: String,
      validate: {
        validator: (pass) => this.password === pass,
        message: "Confirm password did not match",
      },

      follower: [mongoose.Types.ObjectId],
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

// Encrypting password before savin to database
userSchema.pre("save", async function (next) {
  const encryptedPassword = await bcrypt.hash(this.password, 12);
  console.log(encryptedPassword);
  this.password = encryptedPassword;
  this.confirmPassowrd = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log("checking password");
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
