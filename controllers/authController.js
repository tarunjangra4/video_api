// const express = require("express");
// const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
require("dotenv").config();

// sign up api app.post("/api/register",
exports.register = async (req, res) => {
  const authHeader = req.body.headers.Authorization.split(" ")[1];
  const decodedCredentials = atob(authHeader).split(":");
  const [email, password] = [decodedCredentials[0], decodedCredentials[1]];

  if (!email) {
    return res.status(401).json({
      status: "error",
      error: "Please Provide a valid email.",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      createdAt: Date.now(),
    });

    return res
      .status(200)
      .json({ status: "ok", message: "User has been created." });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      return res.status(400).json({
        status: "error",
        error: "Email already exists. Please use a different email.",
      });
    } else {
      // Other errors
      return res.status(500).json({
        status: "error",
        error: "Registration failed due to an internal server error.",
      });
    }
  }
};

// login api app.post("/api/login",
exports.login = async (req, res) => {
  // console.log("req.body.headers ", req.headers["authorization"]);
  const authHeader = req.body.headers.Authorization.split(" ")[1];
  const decodedCredentials = atob(authHeader).split(":");
  // console.log("decodedCredentials ", decodedCredentials);
  const [userEmail, userPassword] = [
    decodedCredentials[0],
    decodedCredentials[1],
  ];
  // if (!req.body.email) {
  if (!userEmail) {
    return res.status(401).json({
      status: "error",
      error: "Please Provide a valid email.",
    });
  }

  try {
    const user = await User.findOne({
      // email: req.body.email,
      email: userEmail,
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        error:
          "User not found. Please check your email or create a new account.",
      });
    } else {
      console.log(user._id.toHexString());
      const isPasswordValid = await bcrypt.compare(
        // req.body.password,
        userPassword,
        user.password
      );

      if (isPasswordValid) {
        const token = jwt.sign(
          { email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          // { algorithm: "RS256" }
          { expiresIn: 604800 }
        );
        return res.status(200).json({ status: "ok", token });
      } else {
        return res
          .status(401)
          .json({ status: "error", error: "Password is invalid." });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal server error. Please try again later.",
    });
  }
};

//reset password api
exports.resetPassword = async (req, res) => {
  const authHeader = req.body.headers.Authorization.split(" ")[1];
  const decodedCredentials = atob(authHeader).split(":");
  const [email, currPassword, password] = [
    decodedCredentials[0],
    decodedCredentials[1],
    decodedCredentials[2],
  ];
  console.log(
    "email and password and currPassword ",
    email,
    password,
    currPassword
  );
  if (!email) {
    return res.status(401).json({
      status: "error",
      error: "Please Provide a valid email.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        error: "Email does not exist.",
      });
    } else {
      const isPasswordValid = await bcrypt.compare(currPassword, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ status: "error", error: "Current Password is invalid." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
    }
    console.log("End");
    return res
      .status(200)
      .json({ status: "ok", message: "Password has been updated." });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      error: "Error upadting the password.",
    });
  }
};
