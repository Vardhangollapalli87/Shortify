const mongoose = require("mongoose");
const validator = require("validator");

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
      validate: {
        validator(value) {
          return validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true
          });
        },
        message: "Original URL must be a valid HTTP or HTTPS URL"
      }
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
      match: [/^[a-zA-Z0-9_-]+$/, "Short code may only contain letters, numbers, underscores, and hyphens"]
    },
    title: {
      type: String,
      trim: true,
      maxlength: 160
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true
    },
    passwordHash: {
      type: String,
      select: false
    },
    totalClicks: {
      type: Number,
      default: 0
    },
    uniqueClicks: {
      type: Number,
      default: 0
    },
    lastClickedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

urlSchema.index({ userId: 1, createdAt: -1 });

urlSchema.virtual("isPasswordProtected").get(function isPasswordProtected() {
  return Boolean(this.passwordHash);
});

const ShortUrl = mongoose.model("ShortUrl", urlSchema);

module.exports = ShortUrl;
