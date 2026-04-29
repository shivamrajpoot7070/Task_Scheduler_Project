import redis from "../config/redis.js";
import logger from "../common/logger.js";

// Queue names
const QUEUE_NAME = "task_queue";
const DEAD_LETTER_QUEUE = "dead_letter_queue";

// ===============================
// ENQUEUE TASK (Scheduler uses this)
// ===============================
export async function enqueueTask(task) {
  try {
    await redis.lpush(QUEUE_NAME, JSON.stringify(task));

    logger.info(`📥 Task enqueued: ${task.id}`);
  } catch (error) {
    logger.error("❌ Failed to enqueue task", error);
    throw error;
  }
}

// ===============================
// DEQUEUE TASK (Worker uses this)
// ===============================
export async function dequeueTask() {
  try {
    // BRPOP blocks until item is available
    const result = await redis.brpop(QUEUE_NAME, 0);

    if (!result) return null;

    const [, taskString] = result;
    return JSON.parse(taskString);
  } catch (error) {
    logger.error("❌ Failed to dequeue task", error);
    throw error;
  }
}

// ===============================
// MOVE TO DEAD LETTER QUEUE
// ===============================
export async function moveToDeadLetterQueue(task) {
  try {
    await redis.lpush(DEAD_LETTER_QUEUE, JSON.stringify(task));

    logger.warn(`☠️ Task moved to dead letter queue: ${task.id}`);
  } 
  catch (error) {
    logger.error("❌ Failed to move to DLQ", error);
    throw error;
  }
}

export async function getDeadLetterTasks() {
  const tasks = await redis.lrange("dlq", 0, -1);

  return tasks.map((t) => JSON.parse(t));
}