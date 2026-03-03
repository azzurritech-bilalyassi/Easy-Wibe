// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => { // ⚡ html instead of text
  try {
    const info = await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,  
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email not sent:", error);
    throw new Error("Email could not be sent");
  }
};

// ⚡ Export as named export
module.exports = { sendEmail };