const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const { USER_ROLES, AUTH_PROVIDERS } = require("../constants/auth.constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be at most 80 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Email is invalid"]
    },
    passwordHash: {
      type: String,
      select: false
    },
    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.CREDENTIALS
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    avatarUrl: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    passwordChangedAt: {
      type: Date
    },
    passwordResetTokenHash: {
      type: String,
      select: false
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false
    },
    emailVerificationTokenHash: {
      type: String,
      select: false
    },
    emailVerificationExpiresAt: {
      type: Date,
      select: false
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ passwordResetTokenHash: 1 }, { sparse: true });
userSchema.index({ emailVerificationTokenHash: 1 }, { sparse: true });

userSchema.methods.comparePassword = function comparePassword(password) {
  if (!this.passwordHash) {
    return false;
  }

  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken(expiresInMinutes) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function createEmailVerificationToken(expiresInMinutes) {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.emailVerificationExpiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return verificationToken;
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    authProvider: this.authProvider,
    googleId: this.googleId,
    avatarUrl: this.avatarUrl,
    isEmailVerified: this.isEmailVerified,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
