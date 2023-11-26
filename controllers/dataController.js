require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Introduction = require("../models/introduction.model");
const SEO = require("../models/seo.model");
const GoogleAds = require("../models/google_ads.model");
const FacebookAds = require("../models/facebook_ads.model");
const CRM = require("../models/crm.model");
const ChatBots = require("../models/chat_bots.model");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.uploadData = async (req, res) => {
  //   const authHeader = req.headers["authorization"];
  const token = req.body.headers.Authorization.split(" ")[1];
  // console.log("req.body ", req.body);
  // console.log("req.headers ", req.headers);
  console.log("token ", token);

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    console.log("search");
    const user = await User.findOne({ email: email });
    console.log("find user");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found." });
    }
    console.log("user validate");
    if (user.userRole !== "admin") {
      return res.status(401).json({
        status: "error",
        error: "You are not allowed to do this operation.",
      });
    }

    const contentType = req.body.contentType;
    console.log("contentType ", contentType);
    if (contentType === "Introduction") {
      console.log("if");
      await Introduction.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        videoDescription: req.body.videoDescription,
        createdAt: Date.now(),
      });
    } else if (contentType === "SEO") {
      console.log("seo section entered");
      try {
        await SEO.create({
          video_url: req.body.videoKey,
          thumbnail_url: req.body.imageKey,
          videoName: req.body.name,
          videoDescription: req.body.videoDescription,
          createdAt: Date.now(),
        });
      } catch (error) {
        console.log("error in uploading data", error);
      }
    } else if (contentType === "GoogleAds") {
      await GoogleAds.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        videoDescription: req.body.videoDescription,
        createdAt: Date.now(),
      });
    } else if (contentType === "FacebookAds") {
      await FacebookAds.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        videoDescription: req.body.videoDescription,
        createdAt: Date.now(),
      });
    } else if (contentType === "CRM") {
      await CRM.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        videoDescription: req.body.videoDescription,
        createdAt: Date.now(),
      });
    } else if (contentType === "ChatBots") {
      await ChatBots.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        videoDescription: req.body.videoDescription,
        createdAt: Date.now(),
      });
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Video has been uloaded successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        error: "Token has expired.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        error: "Token is invalid or has been tampered with.",
      });
    }
  }
};

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// // before calling this function check if the user has access or not in both frontend and backend
async function getVideoURL(key) {
  const command = new GetObjectCommand({
    Bucket: "vid.app",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 });
  return url;
}

async function getImageURL(key) {
  const command = new GetObjectCommand({
    Bucket: "thumbnails.video.app",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 });
  return url;
}

async function getDetails(data = []) {
  let newData = [];
  for (const item of data) {
    const obj = {
      id: item._id,
      videoName: item.videoName,
      videoUrl: await getVideoURL(item.video_url),
      thumbnailUrl: await getImageURL(item.thumbnail_url),
      createdAt: item.createdAt,
    };
    newData.push(obj);
  }
  //   console.log("new data ", newData);
  return newData;
}

// update user profile api app.put("/api/user-profile",
exports.getData = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  console.log("req query ", req.query);
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

    let contentType = req.query.contentType;
    if (contentType === "Introduction") {
      //   const data = Introduction.find({}) || [];
      Introduction.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    } else if (contentType === "SEO") {
      SEO.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    } else if (contentType === "GoogleAds") {
      GoogleAds.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    } else if (contentType === "FacebookAds") {
      FacebookAds.find()
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    } else if (contentType === "CRM") {
      CRM.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    } else if (contentType === "ChatBots") {
      ChatBots.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      error: "Session expired, please log in again.",
    });
  }
};
