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
  //   console.log("start 1 ", req.headers);
  //   const authHeader = req.headers["authorization"];
  const token = req.body.headers.Authorization.split(" ")[1];
  console.log("start 2 ", token);
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }
  console.log("start 3 ", req.body);
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    console.log("start 4 ", req.body);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found." });
    }
    console.log("start 5 ", req.body);
    if (user.userRole !== "admin") {
      return res.status(401).json({
        status: "error",
        error: "You are not allowed to do this operation.",
      });
    }
    console.log("start 6 ", req.body);
    const contentType = req.body.contentType;
    console.log("contentType ", contentType);
    if (contentType === "Introduction") {
      console.log("if");
      await Introduction.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        createdAt: Date.now(),
      });
      console.log("start 7");
    } else if (contentType === "SEO") {
      console.log("start 8");
      await SEO.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        createdAt: Date.now(),
      });
      console.log("start 9");
    } else if (contentType === "GoogleAds") {
      console.log("start 10");
      await GoogleAds.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        createdAt: Date.now(),
      });
      console.log("start 11");
    } else if (contentType === "FacebookAds") {
      console.log("start 12");
      await FacebookAds.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        createdAt: Date.now(),
      });
      console.log("start 13");
    } else if (contentType === "CRM") {
      console.log("start 14");
      await CRM.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        createdAt: Date.now(),
      });
      console.log("start 15");
    } else if (contentType === "ChatBots") {
      console.log("start 16");
      await ChatBots.create({
        video_url: req.body.videoKey,
        thumbnail_url: req.body.imageKey,
        videoName: req.body.name,
        createdAt: Date.now(),
      });
      console.log("start 17");
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
      console.log("if");
      //   const data = Introduction.find({}) || [];
      Introduction.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) => console.log(error1));
    } else if (contentType === "SEO") {
      console.log("start 8");
      SEO.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) => console.log(error1));
    } else if (contentType === "GoogleAds") {
      console.log("start 10");
      GoogleAds.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) => console.log(error1));
    } else if (contentType === "FacebookAds") {
      console.log("start 12");
      FacebookAds.find()
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) => console.log(error1));
    } else if (contentType === "CRM") {
      console.log("start 14");
      CRM.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) => console.log(error1));
    } else if (contentType === "ChatBots") {
      console.log("start 16");
      ChatBots.find()
        .limit(5)
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) => console.log(error1));
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      error: "Session expired, please log in again.",
    });
  }
};
