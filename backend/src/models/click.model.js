const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    shortCode: {
      type: String,
      required: true
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
    referrerHost: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: "unknown"
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
      default: Date.now
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

clickSchema.index({ urlId: 1, clickedAt: -1 });
clickSchema.index({ userId: 1, clickedAt: -1 });
clickSchema.index({ userId: 1, urlId: 1, clickedAt: -1 });
clickSchema.index({ shortCode: 1, clickedAt: -1 });
clickSchema.index({ urlId: 1, browser: 1, clickedAt: -1 });
clickSchema.index({ urlId: 1, device: 1, clickedAt: -1 });
clickSchema.index({ urlId: 1, os: 1, clickedAt: -1 });
clickSchema.index({ urlId: 1, country: 1, clickedAt: -1 });
clickSchema.index({ urlId: 1, referrerHost: 1, clickedAt: -1 });

const Click = mongoose.model("Click", clickSchema);

module.exports = Click;
