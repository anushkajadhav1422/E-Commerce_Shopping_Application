const express = require('express');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const authAdmin = require("../middleware/authAdmin");
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { getAllUsersInfo, getSingleUserInfo, getUserCart, getUserWishlist, getUserReview, deleteUserReview, deleteUserCartItem, deleteUserWishlistItem, updateProductDetails, userPaymentDetails, addProduct, deleteProduct } = require('../controller/AdminControl');
const { chartData } = require('../controller/AllProductInfo');
dotenv.config()


let success = false
let adminKey = process.env.ADMIN_KEY

exports.registerAdminApi = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, key } = req.body;

  try {
    // ✅ check admin key
    if (key !== process.env.ADMIN_KEY) {
      return res.status(400).json({
        success: false,
        data: "Invalid Admin Key",
      });
    }

    // ✅ check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: "User already exists",
      });
    }

    // ✅ password validation (strong password)
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(password)) {
      return res.status(400).json({
        success: false,
        data:
          "Password must be 8+ chars with uppercase, lowercase, number & special char",
      });
    }

    // ✅ hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ create admin user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
    });

    // ✅ optional: generate token
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      data: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Admin Register Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        data: "Email or phone already exists",
      });
    }

    res.status(500).json({
      success: false,
      data: "Internal server error",
    });
  }
};

exports.loginAdminApi = async (req, res) => {
  const { email, password, key } = req.body;

  try {
    // ✅ find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "User not found",
      });
    }

    // ✅ check admin key
    if (key !== process.env.ADMIN_KEY) {
      return res.status(400).json({
        success: false,
        data: "Invalid Admin Key",
      });
    }

    // ✅ check role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        data: "Not an admin",
      });
    }

    // ✅ check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        data: "Invalid credentials",
      });
    }

    // ✅ generate token
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ store token
    user.tokens.push({ token });
    await user.save();

    res.status(200).json({
      success: true,
      token,
      data: "Login successful",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    res.status(500).json({
      success: false,
      data: "Internal server error",
    });
  }
};
