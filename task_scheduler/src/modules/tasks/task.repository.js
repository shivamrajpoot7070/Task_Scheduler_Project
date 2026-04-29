import { query } from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { TASK_STATUS } from "./task.model.js";

// ===============================
// CREATE TASK
// ===============================
export async function createTask(task) {
  const id = uuidv4();

  const text = `
    INSERT INTO tasks (
      id, type, payload, status,
      scheduled_at, next_run_at,
      retry_count, max_retries
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    id,
    task.type,
    task.payload,
    TASK_STATUS.PENDING,
    task.scheduledAt,
    task.scheduledAt,
    0,
    task.maxRetries || 3
  ];

  const { rows } = await query(text, values);
  return rows[0];
}
// ===============================
// GET + LOCK DUE TASKS (ATOMIC)
// ===============================
export async function getAndLockDueTasks(limit = 10) {
  const text = `
    UPDATE tasks
    SET status = 'QUEUED'
    WHERE id IN (
      SELECT id FROM tasks
      WHERE status IN ('PENDING', 'FAILED')  -- 🔥 FIX
      AND next_run_at <= NOW()
      ORDER BY next_run_at ASC
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING *;
  `;

  const { rows } = await query(text, [limit]);
  return rows;
}

// ===============================
// UPDATE TASK STATUS
// ===============================

export async function updateTaskStatus(id, status) {
  const text = `
    UPDATE tasks
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;

  const { rows } = await query(text, [status, id]);
  return rows[0];
}

// ===============================
// MARK TASK AS PROCESSING
// ===============================
export async function markTaskProcessing(id) {
  return updateTaskStatus(id, TASK_STATUS.PROCESSING);
}

// ===============================
// MARK TASK SUCCESS
// ===============================
export async function markTaskSuccess(id) {
  return updateTaskStatus(id, TASK_STATUS.SUCCESS);
}

// ===============================
// MARK TASK FAILED (with retry logic handled in service)
// ===============================
export async function markTaskFailed(id, error, retryCount, nextRunAt) {
  const text = `
    UPDATE tasks
    SET 
      status = $1,
      retry_count = $2,
      next_run_at = $3,
      last_error = $4,
      updated_at = NOW()
    WHERE id = $5
    RETURNING *;
  `;

  const { rows } = await query(text, [
    TASK_STATUS.FAILED,
    retryCount,
    nextRunAt,
    error,
    id
  ]);

  return rows[0];
}

// ===============================
// MOVE TASK TO DEAD STATE
// ===============================
export async function markTaskDead(id, error) {
  const text = `
    UPDATE tasks
    SET 
      status = $1,
      last_error = $2,
      updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;

  const { rows } = await query(text, [
    TASK_STATUS.DEAD,
    error,
    id
  ]);

  return rows[0];
}

// ===============================
// GET TASK BY ID
// ===============================
export async function getTaskById(id) {
  const text = `
    SELECT * FROM tasks WHERE id = $1;
  `;

  const { rows } = await query(text, [id]);
  return rows[0];
}

export async function getAllTasks({ status, limit, offset }) {
  let queryText = `
    SELECT * FROM tasks
  `;
  const values = [];

  if (status) {
    queryText += ` WHERE status = $1`;
    values.push(status);
  }

  queryText += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const { rows } = await query(queryText, values);
  return rows;
}

// ===============================
// DELETE TASK
// ===============================

export async function deleteTaskById(id) {

  const text = `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING *;
  `;

  const { rows } = await query(text, [id]);
  return rows[0];
}


// ===============================
// GET TASK STATS
// ===============================
export async function getTaskStats() {
  const text = `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'SUCCESS') AS success,
      COUNT(*) FILTER (WHERE status = 'FAILED') AS failed,
      COUNT(*) FILTER (WHERE status = 'PROCESSING') AS processing,
      COUNT(*) FILTER (WHERE status = 'PENDING') AS pending,
      COUNT(*) FILTER (WHERE status = 'DEAD') AS dead
    FROM tasks;
  `;

  const { rows } = await query(text);
  return rows[0];
}


// ===============================
// MARK TASK AS PROCESSING (SAFE)
// ===============================
export async function markTaskProcessingSafe(id) {
  const text = `
    UPDATE tasks
    SET status = 'PROCESSING'
    WHERE id = $1
    AND status = 'QUEUED'
    RETURNING *;
  `;

  const { rows } = await query(text, [id]);
  return rows[0]; // undefined if already processed
}

// ===============================
// GET DEAD TASKS (for DLQ view) from DB
// ===============================

export async function getDeadTasksFromDB() {
  const text = `
    SELECT * FROM tasks
    WHERE status = 'DEAD'
    ORDER BY updated_at DESC;
  `;

  const { rows } = await query(text);
  return rows;
}


// ===============================
// RETRY DEAD TASK
// ===============================
export async function retryTaskById(id) {
  
  const text = `
    UPDATE tasks
    SET 
      status = 'PENDING',
      retry_count = 0,
      next_run_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    AND status = 'DEAD'
    RETURNING *;
  `;

  const { rows } = await query(text, [id]);
  return rows[0];
}


// ===============================
// GET TASKS WITH PAGINATION
// ===============================
export async function getTasksPaginated({ limit = 10, offset = 0 }) {
  const text = `
    SELECT *
    FROM tasks
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;
  `;

  const { rows } = await query(text, [limit, offset]);
  return rows;
}

// ===============================
// GET TOTAL COUNT
// ===============================
export async function getTasksCount(status) {
  let queryText = `SELECT COUNT(*) FROM tasks`;
  const values = [];

  if (status) {
    queryText += ` WHERE status = $1`;
    values.push(status);
  }

  const { rows } = await query(queryText, values);
  return Number(rows[0].count);
}

// ===============================
// GET METRICS FOR DASHBOARD
// ===============================


export async function getMetrics() {
  const text = `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'SUCCESS') AS success,
      COUNT(*) FILTER (WHERE status = 'FAILED') AS failed,
      COUNT(*) FILTER (WHERE status = 'DEAD') AS dead,
      COUNT(*) FILTER (WHERE retry_count > 0) AS retried
    FROM tasks;
  `;

  const { rows } = await query(text);
  return rows[0];
}


