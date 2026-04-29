import { ZodError } from "zod";
import { AppError } from "./errors.js";

// ===============================
// Generic validation middleware
// ===============================
export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Attach validated data (clean + safe)
      req.validated = parsedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => e.message).join(", ");
        return next(new AppError(message, 400));
      }

      next(error);
    }
  };
}