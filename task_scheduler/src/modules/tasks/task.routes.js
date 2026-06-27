import express from "express";
import { z } from "zod";

import {
  createTaskController,
  getTaskByIdController,
  getDueTasksController,
  getAllTasksController
} from "./task.controller.js";

import { getTaskLogsController } from "./task.controller.js";
import { validate } from "../../common/validation.js";
import { deleteTaskController } from "./task.controller.js";
import { getTaskStatsController } from "./task.controller.js";
import { getDLQTasksController } from "./task.controller.js";
import { getDeadTasksController } from "./task.controller.js";
import { retryTaskController } from "./task.controller.js";
import { getMetricsController } from "./task.controller.js";

const router = express.Router();


const emailPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  text: z.string().min(1),
  html: z.string().optional()
});

export const createTaskSchema = z.object({
  body: z.object({
    type: z.enum(["EMAIL", "DATA_PROCESSING"]),

    payload: emailPayloadSchema,

    scheduledAt: z.string().datetime(),

    maxRetries: z.number().min(0).max(10).optional()
  })
});

// ===============================
// ROUTES
// ===============================

// 🔥 IMPORTANT: order matters


// Get all tasks
router.get("/", getAllTasksController);

// Get due tasks
router.get("/due/list", getDueTasksController);

router.get("/:id/logs", getTaskLogsController);

// Get DLQ tasks from db

router.get("/dlq/db", getDeadTasksController);

// Retry task (admin action) moves task from DEAD back to PENDING with reset retry count

router.post("/:id/retry", retryTaskController);

// Get DLQ tasks from redis

router.get("/dlq/list", getDLQTasksController);

// Get task stats for dashboard

router.get("/metrics", getMetricsController);

// Get by ID
router.get("/:id", getTaskByIdController);

// Create task
router.post("/", validate(createTaskSchema), createTaskController);

router.get("/stats/summary", getTaskStatsController);

router.delete("/:id", deleteTaskController);

export default router;