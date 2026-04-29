import express from "express";
import pinoHttp from "pino-http";
import cors from "cors";



import logger from "./common/logger.js";
import { notFoundHandler, globalErrorHandler } from "./common/errors.js";
import taskRoutes from "./modules/tasks/task.routes.js";


const app = express();


// ===============================
// MIDDLEWARES
// ===============================

// JSON parser
app.use(express.json());
// CORS
app.use(cors());

// Logger middleware
app.use(
  pinoHttp({
    logger
  })
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ===============================
// ROUTES (will add later)
// ===============================
// Example:
// app.use("/api/tasks", taskRoutes);

app.use("/api/tasks", taskRoutes);

// ===============================
// ERROR HANDLING (MUST BE LAST)
// ===============================
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;