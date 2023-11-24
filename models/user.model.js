const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    profileImage: { type: String },
    userRole: { type: String },
  },
  {
    collection: "user-data",
  }
);

const model = mongoose.model("UserData", User);

module.exports = model;
