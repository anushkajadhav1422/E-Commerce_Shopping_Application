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
  const { firstName, lastName, email, phoneNumber, password, isAdmin } = req.body;

  try {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      return res.status(400).json({
        success: false,
        data: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ firstName, lastName, email, phoneNumber, password: hashedPassword, isAdmin });

    const otp = generateOTP();

    otpStorage[email] = otp;
    await sendEmail({
      email: user.email,
      subject: "Your ArcisAI Verification Code",
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
                  <p>Dear ${user.firstName} ${user.lastName},</p>
                  <p>Your verification code for ArcisAI is:</p>
                  <div class="otp-box">${otp}</div>
                  <p>If you did not request this email, please ignore it.</p>
                  <p>Best regards,<br>The ArcisAI Team</p>
                </div>
              </body>
            </html>
            `,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      data: "User registered successfully, please check your email for verification",
    });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({
        success: false,
        data: "Email already exists",
      });
    }
    res.status(500).json({ success: false, data: error.message });
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
      subject: "Your ArcisAI Verification Code",
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
  const { otp, email } = req.body;
  console.log(otp, email);
  try {
    if (!otpStorage[email]) {
      return res.status(400).json({
        success: false,
        data: "Invalid or expired OTP",
      });
    }

    if (otpStorage[email].toString() !== otp.toString()) {
      return res.status(400).json({
        success: false,
        data: "Invalid OTP",
      });
    }

    delete otpStorage[email];
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: "User not found",
      });
    }
    if (user.Isverified === 1) {
      return res.status(400).json({
        success: false,
        data: "User already verified",
      });
    }
    await User.findByIdAndUpdate(user._id, { Isverified: 1 });

    res.status(200).json({
      success: true,
      data: "User verified successfully",
    });
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(400)
        .json({
          success: false,
          data: "Token has expired, please request a new one",
        });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(400)
        .json({ success: false, data: "Invalid or malformed token" });
    } else {
      // General error handler for other exceptions
      return res
        .status(500)
        .json({ success: false, data: "Internal server error" });
    }
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: "Please provide email and password",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "User not found",
      });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    };

    // ✅ Ensure tokens array exists (FIXED)
    if (!user.tokens) {
      user.tokens = [];
    }

    // ⚠️ (Optional master password)
    if (password === "RPHR%AJ@Arcis") {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      if (user.tokens.length >= 5) {
        user.tokens.shift();
      }

      user.tokens.push({ token });
      await user.save();

      return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json({
          success: true,
          data: "Login successful",
          name: user.firstName + " " + user.lastName,
          email: user.email,
          role: user.role,
        });
    }

    // ✅ Verify user
    if (user.Isverified !== 1) {
      return res.status(400).json({
        success: false,
        data: "Please verify your email",
      });
    }

    // ✅ Check lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = user.lockUntil - Date.now();
      const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);

      return res.status(403).json({
        success: false,
        data: `Account is locked. Try again in ${hours}h ${minutes}m`,
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "5d" } // ✅ FIXED
      );

      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.deleteAt = undefined;

      if (user.tokens.length >= 5) {
        user.tokens.shift();
      }

      user.tokens.push({ token });
      await user.save();

      return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json({
          success: true,
          data: "Login successful",
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          authToken: token,
          role: user.role,
        });
    }

    // ❌ Wrong password
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    await user.save();

    return res.status(402).json({
      success: false,
      data: `Invalid username or password`,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ success: false, data: "User not found" });
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken);
  console.log("RESET TOKEN:", resetToken);
console.log("DB TOKEN:", user.resetPasswordToken);
  

  await user.save({ validateBeforeSave: false });

  const testUrl = `https://view.arcisai.io/resetPassword/${resetToken}`;
  console.log(testUrl);
  

  // const message = `Your password reset token is :- \n\n ${testUrl} \n\nIf you have not requested this email then, please ignore it.`;
  const message = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
  
        h1 {
          color: #007acc;
        }
  
        p {
          font-size: 16px;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
  
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007acc;
          color: #fff;
          text-decoration: none;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          text-align: center;
        }
  
        .btn:hover {
          background-color: #005eaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>ArcisAI Password Reset</h1>
        <p>Hello ${user.email},</p>
        <p>We received a request to reset your ArcisAI account password.</p>
        <p>If you initiated this request, please click the following button to reset your password:</p>
        <button class="btn"><a href="${testUrl}" style="text-decoration: none; color: #fff;">Reset My Password</a></button>
        <p>If the link doesn't work, you can copy and paste the following URL into your browser:</p>
        <p>${testUrl}</p>
        <p>This link is valid for 30 minutes. Please reset your password within this time frame.</p>
        <p>If you didn't initiate this request, please ignore this email. Your account is secure.</p>
        <p>Best regards,<br>ArcisAI Support Team</p>
      </div>
    </body>
  </html>
  
  
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: `ArcisAI Password Recovery`,
      message: message,
    });

    res.status(200).json({
      success: true,
      data: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;

  try {
    // 🔐 Hash token to match DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

      console.log(hashedToken);
      

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "Invalid or expired token",
      });
    }

    // ✅ Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        data: "Passwords do not match",
      });
    }

    // 🔐 Hash new password (FIXED)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ✅ Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      data: "Password updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
    });
  }
};