import * as taskService from "./task.service.js";
import { AppError } from "../../common/errors.js";

// ===============================
// CREATE TASK
// ===============================
export async function createTaskController(req, res, next) {
  try {
    const { body } = req.validated;

    const task = await taskService.createTaskService(body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// ===============================
// GET TASK BY ID
// ===============================
export async function getTaskByIdController(req, res, next) {
  try {
    const { id } = req.params;

    const task = await taskService.getTaskByIdService(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// ===============================
// GET ALL DUE TASKS (for debugging)
// ===============================
export async function getDueTasksController(req, res, next) {
  try {
    const tasks = await taskService.getDueTasksService();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllTasksController(req, res, next) {
  try {
    const { status, page = 1, limit = 6 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const { tasks, total } = await taskService.getAllTasksService({
      status,
      limit: limitNum,
      offset
    });

    res.status(200).json({
      success: true,
      data: tasks,
      page: pageNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    next(error);
  }
}

import { getTaskLogs } from "./task.log.repository.js";

export async function getTaskLogsController(req, res, next) {
  try {
    const { id } = req.params;

    const logs = await getTaskLogs(id);

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
}


export async function deleteTaskController(req, res, next) {
  try {
    const { id } = req.params;

    const deletedTask = await taskService.deleteTaskService(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask
    });
  } catch (error) {
    next(error);
  }
}

// ===============================
// RETRY TASK (admin action) moves task from DEAD back to PENDING with reset retry count
// ===============================

export async function getTaskStatsController(req, res, next) {
  try {
    const stats = await taskService.getTaskStatsService();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// GET DLQ TASKS FROM REDIS
// ===============================


export async function getDLQTasksController(req, res, next) {
  try {
    const tasks = await taskService.getDLQTasksService();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// GET DEAD TASKS FROM DB (for admin view)
// ===============================



export async function getDeadTasksController(req, res, next) {
  try {
    const tasks = await taskService.getDeadTasksService();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// RETRY TASK (admin action) moves task from DEAD back to PENDING with reset retry count
// ===============================

export async function retryTaskController(req, res, next) {
  try {
    const { id } = req.params;

    const task = await taskService.retryTaskService(id);

    console.log("Retry clicked:", id);

    res.status(200).json({
      success: true,
      message: "Task moved back to queue",
      data: task
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// GET METRICS (for dashboard)


export async function getMetricsController(req, res, next) {
  try {
    const metrics = await taskService.getMetricsService();

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (err) {
    next(err);
  }
}