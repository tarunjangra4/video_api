const mongoose = require("mongoose");

const ChatBots = new mongoose.Schema(
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
    collection: "chat-bots-videos",
  }
);

const model = mongoose.model("ChatBots", ChatBots);

module.exports = model;
