// Base custom error
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ===============================
// 404 Handler (Route not found)
// ===============================
export function notFoundHandler(req, res, next) {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
}

// ===============================
// Global Error Handler
// ===============================
export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || "Internal Server Error"
  };

  // Show stack only in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}