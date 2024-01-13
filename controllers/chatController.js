require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Chat = require("../models/chats.model");
const User = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;

exports.createChat = async (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log("auth header ", authHeader);
  const testToken = authHeader.split(" ")[1];
  console.log("testToken ", testToken);

  const token = req.body.headers.Authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  const videoId = req?.body?.videoId;
  const message = req?.body?.message;
  const parentChat = req?.body?.parentChat;
  const createdAt = Date.now();
  const addedBy = req?.body?.addedBy;

  if (!videoId) {
    return res.status(401).json({
      status: "error",
      error: "Please provide video Id.",
    });
  } else if (!message) {
    return res.status(401).json({
      status: "error",
      error: "Message cannot be empty.",
    });
  } else if (!parentChat) {
    return res.status(401).json({
      status: "error",
      error: "Please provide parent Chat Id.",
    });
  } else if (!addedBy) {
    return res.status(401).json({
      status: "error",
      error: "Please provide the user Id.",
    });
  }
  try {
    await Chat.create({
      videoId,
      message,
      parentChat,
      createdAt,
      addedBy,
    });
    return res
      .status(200)
      .json({ status: "success", message: "Chat created successfully." });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ status: "error", error: "Internal Server Error." });
  }
};

// get video chat api
exports.getVideoChats = async (req, res) => {
  const token = req.body.headers.Authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  const videoId = req.body?.videoId;
  const chatsList = await Chat.find({ videoId });
};

// delete chat api
exports.deleteChat = async (req, res) => {
  const token = req.body.headers.Authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  const chatId = req.body?.chatId;
  const userId = req.body?.userId; // the user who is currently deleting the chat.

  if (!chatId) {
    return res
      .status(401)
      .json({ status: "error", message: "Please provide a Chat Id." });
  } else if (!userId) {
    return res
      .status(401)
      .json({ status: "error", message: "Please provide a User Id." });
  }

  try {
    const chatObj = await Chat.findOne({ _id: chatId });
    const user = await User.findOne({ _id: userId });

    if (!chatObj) {
      return res.status(404).json({
        status: "error",
        message: "Chat not found.",
      });
    }

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User Not found." });
    } else if (user?.userRole !== "admin" || chatObj?.addedBy !== userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authorize to perform this operation.",
      });
    }

    await Chat.deleteOne({ _id: new ObjectId(chatId) });
    return res.status(200).json({
      status: "ok",
      message: "Chat has been deleted successfully.",
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server error.",
    });
  }
};
