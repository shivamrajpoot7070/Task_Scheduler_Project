import { sendEmail } from "./email.handler.js";
import { processData } from "./data.handler.js";
import { TASK_TYPES } from "../modules/tasks/task.model.js";

// ===============================
// TASK DISPATCHER
// ===============================
export async function executeTask(task) {
  switch (task.type) {
    case TASK_TYPES.EMAIL:
      return sendEmail(task);

    case TASK_TYPES.DATA_PROCESSING:
      return processData(task);

    default:
      throw new Error(`No handler found for task type: ${task.type}`);
  }
}