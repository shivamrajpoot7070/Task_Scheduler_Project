import nodemailer from "nodemailer";
import env from "../config/env.js";

// ===============================
// SMTP TRANSPORTER
// ===============================
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // TLS starts automatically on port 587

  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

// ===============================
// VERIFY SMTP CONNECTION
// ===============================
export async function verifyMailer() {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP connected");
  } 
  catch (error) {
  console.error("❌ SMTP Connection Failed");
  console.error("Message:", error.message);
  console.error("Code:", error.code);
  console.error("Response:", error.response);
  console.error(error);
}
}

// ===============================
// SEND EMAIL
// ===============================
export async function sendMail({
  to,
  subject,
  text,
  html,
}) {
  return transporter.sendMail({
    from: `"Distributed Task Scheduler" <${env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });
}