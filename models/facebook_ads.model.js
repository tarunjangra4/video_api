const mongoose = require("mongoose");

const FacebookAds = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    videoName: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "facebook-ads-videos",
  }
);

const model = mongoose.model("FacebookAds", FacebookAds);

module.exports = model;
