import env from "../config/env.js";
import logger from "../common/logger.js";

import { getDueTasksService } from "../modules/tasks/task.service.js";
import { enqueueTask } from "../queue/redis.queue.js";
import { createTaskLog } from "../modules/tasks/task.log.repository.js"; // ✅ add this

// ===============================
// SCHEDULER LOOP
// ===============================
async function schedulerLoop() {
  try {
    const tasks = await getDueTasksService();

    if (tasks.length > 0) {
      logger.info(`📦 Found ${tasks.length} due tasks`);
    }

    for (const task of tasks) {
      try {
        // Push to Redis queue
        await enqueueTask(task);

        // Log success
        await createTaskLog(
          task.id,
          "QUEUED",
          "Task moved to queue"
        );

        logger.info(`📥 Task enqueued: ${task.id}`);
      }
       catch (err) {
        logger.error(`❌ Failed to enqueue task ${task.id}`, err);

        // 🔥 IMPORTANT: rollback strategy (basic)
        // You can move it back to PENDING so it retries next loop
        // (optional but recommended)
      }
    }
  } catch (error) {
    logger.error("❌ Scheduler error", error);
  }
}

// ===============================
// START LOOP
// ===============================
function startScheduler() {
  logger.info("🧠 Scheduler started");

  setInterval(schedulerLoop, env.SCHEDULER_INTERVAL_MS);
}

startScheduler();