const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    shortCode: {
      type: String,
      required: true,
      index: true
    },
    ipHash: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    referrer: {
      type: String,
      default: null
    },
    device: {
      type: String,
      default: "unknown"
    },
    browser: {
      type: String,
      default: "unknown"
    },
    os: {
      type: String,
      default: "unknown"
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

clickSchema.index({ urlId: 1, clickedAt: -1 });
clickSchema.index({ userId: 1, clickedAt: -1 });

const Click = mongoose.model("Click", clickSchema);

module.exports = Click;
