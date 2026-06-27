import logger from "../common/logger.js";
import { sendMail } from "../services/mail.service.js";

// ===============================
// REAL EMAIL HANDLER
// ===============================
export async function sendEmail(task) {
  
  const { to, subject, text } = task.payload;

  logger.info(`📧 Sending email to ${to}`);

  const info = await sendMail({
    to,
    subject,
    text,
  });

  logger.info(`✅ Email sent successfully`);
  logger.info(`📨 Message ID: ${info.messageId}`);

  return info;
}