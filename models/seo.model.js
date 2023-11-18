const mongoose = require("mongoose");

const SEO = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    videoName: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "seo-videos",
  }
);

const model = mongoose.model("SEO", SEO);

module.exports = model;
