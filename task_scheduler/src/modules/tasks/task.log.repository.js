import { query } from "../../config/db.js";

// ===============================
// CREATE LOG
// ===============================
export async function createTaskLog(taskId, status, message = "") {
  const text = `
    INSERT INTO task_logs (task_id, status, message)
    VALUES ($1, $2, $3)
  `;

  await query(text, [taskId, status, message]);
}

// ===============================
// GET LOGS BY TASK ID
// ===============================
export async function getTaskLogs(taskId) {
  const text = `
    SELECT * FROM task_logs
    WHERE task_id = $1
    ORDER BY created_at ASC
  `;

  const { rows } = await query(text, [taskId]);
  return rows;
}