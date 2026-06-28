const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },

    role: {
      type: String,
      enum: ["admin", "freelancer", "client"],
      default: "freelancer",
    },

    // Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // Password Reset
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // Google OAuth
    googleId: {
      type: String,
      default: null,
    },

    // Two Factor Authentication
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


const Usermodel = mongoose.model("User", userSchema);

module.exports = Usermodel;