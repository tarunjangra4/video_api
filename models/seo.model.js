const mongoose = require("mongoose");

const SEO = new mongoose.Schema(
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
    collection: "seo-videos",
  }
);

const model = mongoose.model("SEO", SEO);

module.exports = model;
