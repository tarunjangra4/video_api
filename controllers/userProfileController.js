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
  const obj = {
    email: data.email,
    name: data.name,
    phoneNumber: data.phoneNumber,
    profileUrl: await getImageURL(data.profileImage),
    videoDetails: data.videoDetails,
  };
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
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    console.log("existingUser ", existingUser);
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

    console.log("req body ", req.body);

    console.log(
      "in mid",
      req?.body?.profileImage || existingUser.profileImage || "=="
    );
    console.log(
      "mid2 ",
      existingUser.createdAt ||
        Date.now() +
          " - " +
          req.body?.videoId +
          " - " +
          req.body?.percentageWatched
    );
    existingUser.phoneNumber = phoneNumber;
    existingUser.name = req.body?.name || existingUser.name || "";
    existingUser.profileImage =
      req.body?.profileImage || existingUser.profileImage;
    existingUser.bio = req.body?.bio || existingUser.bio || "";
    existingUser.createdAt = existingUser.createdAt || Date.now();
    existingUser.videoDetails.set(
      req.body?.videoId,
      req.body?.percentageWatched
    );
    try {
      await existingUser.save();
    } catch (error) {
      console.error("save res error", error);
      return res.status(500).json({
        status: "error",
        error: "Internal Server Error.",
      });
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Profile updated successfully." });
  } catch (error) {
    console.log("endo ", error);
    return res.status(401).json({
      status: "error",
      error: "Internal Server Error.",
    });
  }
};
