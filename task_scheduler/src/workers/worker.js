import "dotenv/config";

import logger from "../common/logger.js";
import { createTaskLog } from "../modules/tasks/task.log.repository.js";
import { dequeueTask, moveToDeadLetterQueue } from "../queue/redis.queue.js";

import {
  handleTaskFailure,
  markTaskSuccess
} from "../modules/tasks/task.service.js";

import { executeTask } from "../handlers/index.js";
import { markTaskProcessingSafe } from "../modules/tasks/task.repository.js"; // 🔥 NEW

// ===============================
// WORKER LOOP
// ===============================
async function workerLoop() {
  logger.info("⚙️ Worker started...");

  while (true) {
    try {
      // Wait for task (blocking)
      const task = await dequeueTask();

      if (!task) continue;

      // 🔥 STEP 1: LOCK TASK (CRITICAL)
      const lockedTask = await markTaskProcessingSafe(task.id);

      if (!lockedTask) {
        logger.warn(`⚠️ Skipping duplicate task: ${task.id}`);
        continue; // 🚀 prevents duplicate execution
      }

      logger.info(`🚀 Processing task: ${task.id}`);

      try {
        // 🔹 Log processing start
        await createTaskLog(
          task.id,
          "PROCESSING",
          "Worker started processing"
        );

        // 🔹 Execute actual task
        await executeTask(task);

        // 🔹 Mark success
        await markTaskSuccess(task.id);

        logger.info(`✅ Task completed: ${task.id}`);
      } 
      catch (error) {
        logger.error(`❌ Task failed: ${task.id}`, error);

        // 🔹 Handle retry logic
        const updatedTask = await handleTaskFailure(
          task,
          error.message
        );

        // 🔹 If DEAD → push to DLQ
        if (updatedTask.status === "DEAD") {
          await moveToDeadLetterQueue(task);
        }
      }
    } 
    catch (error) {
      logger.error("❌ Worker loop error", error);
    }
  }
}

// ===============================
// START WORKER
// ===============================
workerLoop();