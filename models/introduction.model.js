const mongoose = require("mongoose");

const Introduction = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    videoName: { type: String, required: true },
    videoDescription: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "introduction-videos",
  }
);

const model = mongoose.model("Introduction", Introduction);

module.exports = model;
