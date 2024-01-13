const mongoose = require("mongoose");

const Chats = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
    message: { type: String, required: true },
    parentChat: { type: String },
    createdAt: { type: Date, required: true },
    addedBy: { type: String, required: true },
    userRole: { type: String },
    readByUsers: { type: Array, of: String, default: [] }, // list of users by who already seen it.
    accessedBy: { type: Array, of: String, default: [] }, // list of users to whom the chat will be visible
  },
  {
    collection: "user-admin-chats",
  }
);

const model = mongoose.model("UserAdminChat", Chats);

module.exports = model;
