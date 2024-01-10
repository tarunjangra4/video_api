const mongoose = require("mongoose");

const GoogleAds = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    pdf_url: { type: String, required: false },
    videoName: { type: String, required: true },
    videoDescription: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "google-ads-videos",
  }
);

const model = mongoose.model("GoogleAds", GoogleAds);

module.exports = model;
