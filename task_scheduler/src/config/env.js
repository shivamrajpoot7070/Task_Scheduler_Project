import 'dotenv/config';
import { z } from "zod";

// ===============================
// ENV VALIDATION SCHEMA
// ===============================
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().default(5000),

  // PostgreSQL
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),

  DATABASE_URL: z.string().optional(),

  // Redis
  REDIS_URL: z.string(),

  // Scheduler
  SCHEDULER_INTERVAL_MS: z.coerce.number().default(1000),
  MAX_RETRIES: z.coerce.number().default(3),
  RETRY_BASE_DELAY_MS: z.coerce.number().default(5000),

  // Logging
  LOG_LEVEL: z.string().default("info")
});

// ===============================
// VALIDATE ENV
// ===============================
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

// ===============================
// EXPORT CLEAN ENV
// ===============================
const env = parsedEnv.data;

export default env;