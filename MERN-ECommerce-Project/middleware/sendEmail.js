const nodeMailer = require("nodemailer");
const transporter = require("./mail");

const sendEmail = async ({
  email,
  subject,
  message,
  attachments = [],
}) => {
  try {
    const mailOptions = {
      from: `"Shop It" <${process.env.SMPT_MAIL}>`,
      to: email,
      subject,
      html: message,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email Sent Successfully");
    console.log("To        :", email);
    console.log("Subject   :", subject);
    console.log("Message ID:", info.messageId);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return info;
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Email Sending Failed");
    console.error("To      :", email);
    console.error("Subject :", subject);
    console.error(error);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    throw error;
  }
};

module.exports = sendEmail;

