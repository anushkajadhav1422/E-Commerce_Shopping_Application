const resend = require("./resendConfig");

const sendEmail = async ({
  email,
  subject,
  message,
}) => {
  try {

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: subject,
      html: message,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email Sent Successfully");
    console.log("To:", email);
    console.log("Subject:", subject);
    console.log(response);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return response;

  } catch (error) {

    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Email Sending Failed");
    console.error(error);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    throw error;
  }
};

module.exports = sendEmail;