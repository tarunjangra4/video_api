const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

// get user profile api app.get("/api/user-profile",
exports.getUserProfile = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found." });
    }

    const userData = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return res.status(200).json({ status: "ok", user: userData });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        error: "Token has expired.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        error: "Token is invalid or has been tampered with",
      });
    }
  }
};

exports.getUserRole = async (req, res) => {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found." });
    }

    const userRole = user.userRole || "user";

    return res.status(200).json({ status: "ok", userRole });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        error: "Token has expired.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        error: "Token is invalid or has been tampered with",
      });
    }
  }
};

// update user profile api app.put("/api/user-profile",
exports.updateUserProfile = async (req, res) => {
  console.log("put 1");
  const authHeader = req.headers["authorization"] || "abc ksdflk";
  console.log("put 2 ", authHeader);
  const token = authHeader.split(" ")[1];
  console.log("put 3");
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }
  console.log("put 4");
  try {
    console.log("put 5");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    const phoneNumber = req.body.phoneNumber || "";

    if (phoneNumber) {
      // Check if the provided phone number already exists in the database
      const userWithPhoneNumber = await User.findOne({ phoneNumber });
      if (userWithPhoneNumber && userWithPhoneNumber.email !== email) {
        return res.status(400).json({
          status: "error",
          error: "Phone number already exists for another user.",
        });
      }
    }

    // await User.updateOne({ email: email }, { $set: { name: req.body.name } });
    // if (!req.body.name) {
    //   return res.json({ status: "error", error: "Name can't be empty." });
    // }
    console.log("req body ", req.body);
    existingUser.phoneNumber = phoneNumber;
    existingUser.name = req.body.name || "";
    existingUser.profileImage = req.body.profileImage;
    await existingUser.save();

    return res
      .status(200)
      .json({ status: "ok", message: "Profile updated successfully." });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      error: "Session expired, please log in again.",
    });
  }
};
