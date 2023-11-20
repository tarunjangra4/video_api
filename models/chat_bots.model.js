const mongoose = require("mongoose");

const ChatBots = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    videoName: { type: String, required: true },
    videoDescription: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: "chat-bots-videos",
  }
);

const model = mongoose.model("ChatBots", ChatBots);

module.exports = model;
