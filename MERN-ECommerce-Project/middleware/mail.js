const nodemailer = require("nodemailer");
console.log("reading mail.js file");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});
console.log("MAIL:", process.env.SMPT_MAIL);
console.log("PASSWORD EXISTS:", !!process.env.SMPT_PASSWORD);

(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Server Connected Successfully");
  } catch (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error);
  }
})();

module.exports = transporter;