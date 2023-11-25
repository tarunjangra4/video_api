require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function getImageURL(key) {
  const command = new GetObjectCommand({
    Bucket: "thumbnails.video.app",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 });
  return url;
}

async function getDetails(data) {
  console.log("getDetails start");
  const obj = {
    email: data.email,
    name: data.name,
    phoneNumber: data.phoneNumber,
    profileUrl: await getImageURL(data.profileImage),
  };
  console.log("object ", obj);
  return obj;
}

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
    console.log("I am here and you?");
    const userDataWithProfileImage = await getDetails(user).then((result) => {
      return result;
    });

    return res
      .status(200)
      .json({ status: "ok", user: userDataWithProfileImage });
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
  const authHeader = req.body.headers.Authorization;
  const token = authHeader.split(" ")[1];
  console.log("token ", token);
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    console.log("try block 1");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    console.log("try block 2");
    const phoneNumber = req.body.phoneNumber || existingUser.phoneNumber;

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
    console.log("try block 3");

    existingUser.phoneNumber = phoneNumber;
    existingUser.name = req.body.name || existingUser.name;
    existingUser.profileImage =
      req.body.profileImage || existingUser.profileImage;
    console.log("try block 4");
    await existingUser.save();
    console.log("try block 5");

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
