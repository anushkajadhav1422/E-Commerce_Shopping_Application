const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/sendEmail");
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const otpStorage = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Register User
exports.registerUserApi = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      isAdmin,
    } = req.body;

    // Check required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        data: "All fields are required.",
      });
    }

    // Password validation
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      return res.status(400).json({
        success: false,
        data:
          "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: "Email already exists.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // OTP expiry (10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      isAdmin: isAdmin || false,

      // New Fields
      isVerified: false,
      otp,
      otpExpiry,
    });

    // Send OTP Email
    await sendEmail({
      email: user.email,
      subject: "Shop It Verification Code",
      message: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>

<style>
body{
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
    width:100%;
    padding:40px 0;
}

.container{
    width:600px;
    max-width:90%;
    margin:auto;
    background:#ffffff;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 5px 15px rgba(0,0,0,0.1);
}

.header{
    background:#111827;
    color:#ffffff;
    text-align:center;
    padding:25px;
}

.header h1{
    margin:0;
    font-size:28px;
}

.content{
    padding:35px;
    color:#333333;
    line-height:1.6;
}

.content h2{
    margin-top:0;
}

.otp-box{
    margin:30px auto;
    width:220px;
    text-align:center;
    background:#f3f4f6;
    border:2px dashed #2563eb;
    color:#2563eb;
    padding:18px;
    font-size:32px;
    font-weight:bold;
    letter-spacing:8px;
    border-radius:8px;
}

.info{
    background:#f9fafb;
    border-left:4px solid #2563eb;
    padding:15px;
    margin-top:25px;
    font-size:14px;
}

.footer{
    background:#f3f4f6;
    text-align:center;
    padding:20px;
    color:#6b7280;
    font-size:13px;
}

.footer a{
    color:#2563eb;
    text-decoration:none;
}
</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">
    <h1>🛍️ Shop It</h1>
</div>

<div class="content">

<h2>Hello ${user.firstName},</h2>

<p>
Thank you for creating your account.
</p>

<p>
To complete your registration, please verify your email address using the One-Time Password (OTP) below.
</p>

<div class="otp-box">
${otp}
</div>

<p>
This OTP is valid for <strong>10 minutes</strong>.
</p>

<div class="info">
<strong>Security Tip:</strong><br>
Never share this OTP with anyone. Our team will never ask for your verification code.
</div>

<p style="margin-top:30px;">
If you didn't create this account, you can safely ignore this email.
</p>

<p>

<strong>Happy Shopping!</strong>
</p>

</div>

<div class="footer">

© ${new Date().getFullYear()} Shop It<br>

Thank you for shopping with us ❤️

</div>

</div>

</div>

</body>
</html>
`,
    });

    console.log("Reached success response");

    // Don't generate JWT here

    return res.status(201).json({
      success: true,
      data: "Registration successful. Please verify your email using the OTP sent to your email.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      data: error.message,
    });

  }
};

// resend otp email
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: "User not found",
      });
    }
    const otp = generateOTP();
    otpStorage[email] = otp;
    await sendEmail({
      email: user.email,
      subject: "Shop It Verification Code",
      message: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    color: #333333;
                    font-size: 24px;
                    margin-bottom: 20px;
                  }
                  p {
                    color: #666666;
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 10px;
                  }
                  .otp-box {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #f0f0f0;
                    border-radius: 5px;
                    font-size: 20px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    margin: 20px 0;
                  }
                  .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                    margin-top: 10px;
                  }
                  .btn:hover {
                    background-color: #0056b3;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Welcome to ArcisAI</h1>
                  <p>Dear ${user.name},</p>
                  <p>Your verification code for ArcisAI is:</p>
                  <div class="otp-box">${otp}</div>
                  <p>If you did not request this email, please ignore it.</p>
                  <p>Best regards,<br>The ArcisAI Team</p>
                </div>
              </body>
            </html>
            `,
    });

    return res.status(200).json({
      success: true,
      data: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: error.message });
  }
};

// Verify User
exports.verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified.",
      });
    }

    // Check OTP
    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check OTP Expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Verify User
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      message: "User verified successfully.",
    });

  } catch (error) {

    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};


// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================
    // Validate Request
    // ==========================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ==========================
    // Find User
    // ==========================
    const user = await User.findOne({ email }).select("+password");

    // Don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ==========================
    // Check Email Verification
    // ==========================
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // ==========================
    // Check Account Lock
    // ==========================
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil(
        (user.lockUntil - Date.now()) / (1000 * 60)
      );

      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again after ${remainingMinutes} minute(s).`,
      });
    }

    // ==========================
    // Compare Password
    // ==========================
    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
        user.loginAttempts = 0;
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ==========================
    // Login Success
    // ==========================
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store active tokens (Maximum 5)
    if (!user.tokens) {
      user.tokens = [];
    }

    if (user.tokens.length >= 5) {
      user.tokens.shift();
    }

    user.tokens.push({ token });

    await user.save();

    // Cookie Options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ==========================
    // Validate Email
    // ==========================
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Find User
    const user = await User.findOne({ email });

    // Don't reveal whether user exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      });
    }

    // Generate Reset Token
    const resetToken = user.getResetPasswordToken();
    console.log("resetToken: ",resetToken);
    

    await user.save({ validateBeforeSave: false });

    // Frontend URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    // Email Template
    const message = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">

    <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;">

    <h2>Password Reset Request</h2>

    <p>Hello ${user.firstName},</p>

    <p>
    We received a request to reset your password.
    </p>

    <p>
    Click the button below to reset your password.
    </p>

    <a href="${resetUrl}"
       style="
       display:inline-block;
       background:#2563eb;
       color:#fff;
       text-decoration:none;
       padding:12px 25px;
       border-radius:5px;">
       Reset Password
    </a>

    <p style="margin-top:25px;">
    This link will expire in <b>15 minutes</b>.
    </p>

    <p>
    If you didn't request this, simply ignore this email.
    </p>

    </div>

    </body>
    </html>
    `;

    await sendEmail({
      email: user.email,
      subject: "Reset Your Password",
      message,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    });

  } catch (error) {

    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};

exports.resetPassword = async (req, res) => {
  try {

    const { token, password, confirmPassword } = req.body;

    // ==========================
    // Validate Input
    // ==========================
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Password Match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Strong Password Validation
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character.",
      });
    }

    // Hash Token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find User
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link.",
      });
    }

    // Update Password
    user.password = await bcrypt.hash(password, 10);

    // Remove Reset Token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Logout From All Devices
    user.tokens = [];

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });

  } catch (error) {

    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};