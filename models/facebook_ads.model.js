const mongoose = require("mongoose");

const FacebookAds = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    pdf_url: { type: String, required: false },
    videoName: { type: String, required: true },
    videoDescription: { type: String, required: true },
    completeDescription: { type: String, required: false },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "facebook-ads-videos",
  }
);

const model = mongoose.model("FacebookAds", FacebookAds);

module.exports = model;
