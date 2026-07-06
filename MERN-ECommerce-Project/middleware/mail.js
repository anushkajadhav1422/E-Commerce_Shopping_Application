// config/mail.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

// Verify SMTP connection when server starts
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Server Connected Successfully");
  } catch (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error.message);
  }
})();

module.exports = transporter;