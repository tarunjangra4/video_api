const mongoose = require("mongoose");

const CRM = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    videoName: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "crm-videos",
  }
);

const model = mongoose.model("CRM", CRM);

module.exports = model;
