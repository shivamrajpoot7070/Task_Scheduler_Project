import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    PORT: z.coerce.number().default(5000),

    // Local PostgreSQL (optional)
    POSTGRES_HOST: z.string().optional(),
    POSTGRES_PORT: z.coerce.number().optional(),
    POSTGRES_DB: z.string().optional(),
    POSTGRES_USER: z.string().optional(),
    POSTGRES_PASSWORD: z.string().optional(),

    // Cloud PostgreSQL (Neon)
    DATABASE_URL: z.string().optional(),

    // Redis
    REDIS_URL: z.string(),

    // Scheduler
    SCHEDULER_INTERVAL_MS: z.coerce.number().default(1000),
    MAX_RETRIES: z.coerce.number().default(3),
    RETRY_BASE_DELAY_MS: z.coerce.number().default(5000),

    // Logging
    LOG_LEVEL: z.string().default("info"),
  })
  .superRefine((env, ctx) => {
    const hasDatabaseUrl = !!env.DATABASE_URL;

    const hasLocalConfig =
      env.POSTGRES_HOST &&
      env.POSTGRES_PORT &&
      env.POSTGRES_DB &&
      env.POSTGRES_USER &&
      env.POSTGRES_PASSWORD;

    if (!hasDatabaseUrl && !hasLocalConfig) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Provide either DATABASE_URL or complete PostgreSQL configuration.",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export default parsed.data;