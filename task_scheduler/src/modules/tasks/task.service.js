import env from "../../config/env.js";
import * as taskRepository from "./task.repository.js";
import { TASK_STATUS } from "./task.model.js";
import { createTaskLog } from "./task.log.repository.js";

// ===============================
// CREATE TASK
// ===============================
export async function createTaskService(data) {
  const task = await taskRepository.createTask({
    type: data.type,
    payload: data.payload,
    scheduledAt: new Date(data.scheduledAt),
    maxRetries: data.maxRetries || env.MAX_RETRIES
  });

  await createTaskLog(task.id, "PENDING", "Task created");

  return task;
}

// ===============================
// GET TASK BY ID
// ===============================
export async function getTaskByIdService(id) {
  return taskRepository.getTaskById(id);
}

// ===============================
// GET DUE TASKS (used by scheduler)
// ===============================
export async function getDueTasksService() {
  return taskRepository.getAndLockDueTasks(10);
}

// ===============================
// MARK TASK QUEUED
// ===============================
export async function markTaskQueued(id) {
  const task = await taskRepository.updateTaskStatus(id, TASK_STATUS.QUEUED);

  await createTaskLog(id, "QUEUED", "Task moved to queue");

  return task;
}

// ===============================
// HANDLE TASK FAILURE (CORE LOGIC)
// ===============================
export async function handleTaskFailure(task, errorMessage) {
  const retryCount = task.retry_count + 1;

  await createTaskLog(task.id, "FAILED", errorMessage);

  if (retryCount > task.max_retries) {
    const deadTask = await taskRepository.markTaskDead(task.id, errorMessage);
    await createTaskLog(task.id, "DEAD", "Max retries exceeded");

    return deadTask;
  }

  const delay =
    env.RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);

  const nextRunAt = new Date(Date.now() + delay);

  await createTaskLog(
    task.id,
    "RETRYING",
    `Retry scheduled in ${delay / 1000}s`
  );

  return taskRepository.markTaskFailed(
    task.id,
    errorMessage,
    retryCount,
    nextRunAt
  );
}

// ===============================
// MARK SUCCESS
// ===============================
export async function markTaskSuccess(id) {
  const task = await taskRepository.markTaskSuccess(id);

  await createTaskLog(id, "SUCCESS", "Task completed successfully");

  return task;
}

export async function getAllTasksService({ status, limit, offset }) {
  const tasks = await taskRepository.getAllTasks({
    status,
    limit,
    offset
  });

  const total = await taskRepository.getTasksCount(status);

  return { tasks, total };
}

export async function deleteTaskService(id) {
  
  const task = await taskRepository.deleteTaskById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
}

export async function getTaskStatsService() {
  return taskRepository.getTaskStats();
}



import { getDeadLetterTasks } from "../../queue/redis.queue.js";

export async function getDLQTasksService() {
  return getDeadLetterTasks();
}

// ===============================
// GET DEAD TASKS FROM DB (for admin view)
// ===============================


export async function getDeadTasksService() {
  return taskRepository.getDeadTasksFromDB();
}


// ===============================
// RETRY TASK (admin action) moves task from DEAD back to PENDING with reset retry count
// ===============================


export async function retryTaskService(id) {
  
  const task = await taskRepository.retryTaskById(id);

  if (!task) {
    throw new Error("Task not found or not in DEAD state");
  }

  return task;
}

// ===============================
// PAGINATED TASKS (for admin UI)


export async function getPaginatedTasksService(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const tasks = await taskRepository.getTasksPaginated({ limit, offset });
  const total = await taskRepository.getTasksCount();

  return {
    tasks,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

// ===============================
// GET METRICS (for dashboard)

export async function getMetricsService() {
  const data = await taskRepository.getMetrics();

  const total = Number(data.total) || 1;

  return {
    total,
    successRate: ((data.success / total) * 100).toFixed(2),
    failureRate: ((data.failed / total) * 100).toFixed(2),
    deadRate: ((data.dead / total) * 100).toFixed(2),
    retried: Number(data.retried)
  };
}