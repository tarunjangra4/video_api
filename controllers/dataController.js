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

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    console.log("try");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found." });
    }

    if (user.userRole !== "admin") {
      return res.status(401).json({
        status: "error",
        error: "You are not allowed to do this operation.",
      });
    }

    const contentType = req.body.contentType;
    const obj = {
      video_url: req?.body?.videoKey,
      thumbnail_url: req?.body?.imageKey,
      pdf_url: req?.body?.pdfKey,
      videoName: req?.body?.name,
      videoDescription: req?.body?.videoDescription,
      createdAt: Date.now(),
    };
    console.log("obj ", obj);
    if (contentType === "Introduction") {
      await Introduction.create(obj);
    } else if (contentType === "SEO") {
      await SEO.create(obj);
    } else if (contentType === "GoogleAds") {
      await GoogleAds.create(obj);
    } else if (contentType === "FacebookAds") {
      await FacebookAds.create(obj);
    } else if (contentType === "CRM") {
      await CRM.create(obj);
    } else if (contentType === "ChatBots") {
      await ChatBots.create(obj)
        .then((res) => console.log("chatbot response ", res))
        .catch((err) => console.log("chatbot error ", err));
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

async function getPdfURL(key) {
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
      videoUrl: item.video_url ? await getVideoURL(item.video_url) : "",
      thumbnailUrl: item.thumbnail_url
        ? await getImageURL(item.thumbnail_url)
        : "",
      pdfUrl: item.pdf_url ? await getPdfURL(item.pdf_url) : "",
      createdAt: item.createdAt,
    };
    newData.push(obj);
  }
  return newData;
}

// update user profile api app.put("/api/user-profile",
exports.getData = async (req, res) => {
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

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    let contentType = req.query.contentType;
    if (contentType === "Introduction") {
      //   const data = Introduction.find({}) || [];
      Introduction.find()
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
        .then((result) => {
          getDetails(result).then((data) => {
            return res.status(200).json({ content: data || [] });
          });
        })
        .catch((error1) =>
          res.status(500).json({ error: error1 || "Internal Server error." })
        );
    } else {
      try {
        const introData = await Introduction.find({})
          .sort({ createdAt: -1 })
          .limit(10);

        const facebookAdsData = await FacebookAds.find({})
          .sort({ createdAt: -1 })
          .limit(10);

        const googleAdsData = await GoogleAds.find({})
          .sort({ createdAt: -1 })
          .limit(10);

        const chatBotsData = await ChatBots.find({})
          .sort({ createdAt: -1 })
          .limit(10);

        const crmData = await CRM.find({}).sort({ createdAt: -1 }).limit(10);

        const seoData = await SEO.find({}).sort({ createdAt: -1 }).limit(10);

        const allRecentData = [
          ...introData,
          ...facebookAdsData,
          ...googleAdsData,
          ...chatBotsData,
          ...crmData,
          ...seoData,
        ];

        allRecentData?.sort((a, b) => b.createdAt - a.createdAt);
        const mostRecentData = allRecentData.slice(0, 10);
        try {
          const allGetDetailsData = await getDetails(mostRecentData).then(
            (data) => {
              return data;
            }
          );
          return res.status(200).json({ content: allGetDetailsData || [] });
        } catch (error) {
          res.status(500).json({ error: error || "Error fetching Data." });
        }
      } catch (error) {}
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      error: "Session expired, please log in again.",
    });
  }
};

exports.deleteData = async (req, res) => {
  const token = req.body.headers.Authorization.split(" ")[1];

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

    if (user.userRole !== "admin") {
      return res.status(401).json({
        status: "error",
        error: "You are not allowed to do this operation.",
      });
    }

    const contentType = req.body.contentType;
    const contentId = req.body.contentId;
    let deletedContent = null;

    if (contentType === "Introduction") {
      deletedContent = await Introduction.deleteOne({
        _id: ObjectId(contentId),
      });
    } else if (contentType === "SEO") {
      deletedContent = await SEO.deleteOne({ _id: ObjectId(contentId) });
    } else if (contentType === "GoogleAds") {
      deletedContent = await GoogleAds.deleteOne({ _id: ObjectId(contentId) });
    } else if (contentType === "FacebookAds") {
      deletedContent = await FacebookAds.deleteOne({
        _id: ObjectId(contentId),
      });
    } else if (contentType === "CRM") {
      deletedContent = await CRM.deleteOne({ _id: ObjectId(contentId) });
    } else if (contentType === "ChatBots") {
      deletedContent = await ChatBots.deleteOne({ _id: ObjectId(contentId) });
    }

    if (deletedContent.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", error: "Content not found." });
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Video has been removed successfully." });
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

exports.updateData = async (req, res) => {
  const token = req.body.headers.Authorization.split(" ")[1];

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

    if (user.userRole !== "admin") {
      return res.status(401).json({
        status: "error",
        error: "You are not allowed to do this operation.",
      });
    }

    const contentType = req.body.contentType;
    const contentId = req.body.contentId;

    if (contentType === "Introduction") {
      await Introduction.updateOne(
        { _id: ObjectId(contentId) },
        {
          $set: {
            video_url: req.body.videoKey,
            thumbnail_url: req.body.imageKey,
            videoName: req.body.name,
            videoDescription: req.body.videoDescription,
          },
        }
      );
    } else if (contentType === "SEO") {
      await SEO.updateOne(
        { _id: ObjectId(contentId) },
        {
          $set: {
            video_url: req.body.videoKey,
            thumbnail_url: req.body.imageKey,
            videoName: req.body.name,
            videoDescription: req.body.videoDescription,
          },
        }
      );
    } else if (contentType === "GoogleAds") {
      await GoogleAds.updateOne(
        { _id: ObjectId(contentId) },
        {
          $set: {
            video_url: req.body.videoKey,
            thumbnail_url: req.body.imageKey,
            videoName: req.body.name,
            videoDescription: req.body.videoDescription,
          },
        }
      );
    } else if (contentType === "FacebookAds") {
      await FacebookAds.updateOne(
        { _id: ObjectId(contentId) },
        {
          $set: {
            video_url: req.body.videoKey,
            thumbnail_url: req.body.imageKey,
            videoName: req.body.name,
            videoDescription: req.body.videoDescription,
          },
        }
      );
    } else if (contentType === "CRM") {
      await CRM.updateOne(
        { _id: ObjectId(contentId) },
        {
          $set: {
            video_url: req.body.videoKey,
            thumbnail_url: req.body.imageKey,
            videoName: req.body.name,
            videoDescription: req.body.videoDescription,
          },
        }
      );
    } else if (contentType === "ChatBots") {
      await ChatBots.updateOne(
        { _id: ObjectId(contentId) },
        {
          $set: {
            video_url: req.body.videoKey,
            thumbnail_url: req.body.imageKey,
            videoName: req.body.name,
            videoDescription: req.body.videoDescription,
          },
        }
      );
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
