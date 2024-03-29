const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
    userRole: { type: String },
    bio: { type: String },
    createdAt: { type: Date, required: true },
    videoDetails: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    collection: "user-data",
  }
);

const model = mongoose.model("UserData", User);

module.exports = model;
