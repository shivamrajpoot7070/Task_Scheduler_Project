import logger from "../common/logger.js";

// ===============================
// MOCK DATA PROCESSING HANDLER
// ===============================
export async function processData(task) {
  logger.info(`📊 Processing data for task ${task.id}`);

  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  logger.info(`📊 Data processed for task ${task.id}`);
}