require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authController = require("./controllers/authController");
const userProfileController = require("./controllers/userProfileController");
const dataController = require("./controllers/dataController");
// const awsController = require("./controllers/awsController");

// app.use(cors("http://localhost:3000"));
app.use(cors());
app.use(express.json()); // it is just a middleware will parse the body into json

const MONGO_URL = process.env.MONGO_URL;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
// mongoose.connect(MONGO_URL);
// mongoose.connect(
//   "mongodb+srv://tarunjangra4:" +
//     encodeURIComponent("Tarun@123") + // URL-encode the password
//     "@cluster0.euqnn.mongodb.net/video-app?retryWrites=true&w=majority"
// );
mongoose.connect(
  MONGO_URL +
    encodeURIComponent(MONGO_PASSWORD) + // URL-encode the password
    MONGO_DB
);

// testing for environment variables
// app.get("/", (req, res) => {
//   return res.send(
//     `Testing here... MONGO_URL=${MONGO_URL} MONGO_PASSWORD=${MONGO_PASSWORD} MONGO_DB=${MONGO_DB} PORT=${PORT} ACCESS_TOKEN_SECRET=${process.env.ACCESS_TOKEN_SECRET}`
//   );
// });

// Register and login routes from authController
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.put("/api/reset-password", authController.resetPassword);

// User profile and quote routes from respective controllers
app.get(
  "/api/user-profile",
  // authenticateTokenMiddleware,
  userProfileController.getUserProfile
);
app.get(
  "/api/user-role",
  // authenticateTokenMiddleware,
  userProfileController.getUserRole
);
app.put(
  "/api/user-profile",
  // authenticateTokenMiddleware,
  userProfileController.updateUserProfile
);

// video data api's
app.post("/api/content", dataController.uploadData);
app.get("/api/content", dataController.getData);

//
//
// function authenticateTokenMiddleware(req, res, next) {
//   const authHeader = req.body.headers.Authorization.split(" ")[1];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     return res
//       .status(401)
//       .json({ status: "error", error: "Token is missing." });
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res
//         .status(403)
//         .json({ status: "error", error: "You are not authorized." });
//     }

//     req.user = user;
//     next();
//   });
// }

const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT);
