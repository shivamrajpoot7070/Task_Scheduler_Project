import logger from "../common/logger.js";

// ===============================
// MOCK EMAIL HANDLER
// ===============================
export async function sendEmail(task) {
  
  const { email } = task.payload;

  // 🔥 FORCE FAILURE (deterministic test)
  if (email === "fail@test.com") {
    throw new Error("Simulated email failure");
  }

  // 🔥 OPTIONAL: Retry success scenario (very useful)
  if (email === "retry@test.com" && task.retry_count < 2) {
    throw new Error("Fail first 2 times, then succeed");
  }

  logger.info(`📧 Sending email to ${email}`);

  // simulate delay
  await new Promise((res) => setTimeout(res, 1000));

  logger.info(`✅ Email sent successfully to ${email}`);
}