import pkg from "pg";
import env from "./env.js";
import logger from "../common/logger.js";

const { Pool } = pkg;

// ===============================
// DATABASE CONFIG
// ===============================
const isCloudDatabase = !!env.DATABASE_URL;

const pool = new Pool(
  isCloudDatabase
    ? {
        connectionString: env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        database: env.POSTGRES_DB,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
      }
);

// ===============================
// CONNECT FUNCTION
// ===============================
export async function connectDB() {
  try {
    const client = await pool.connect();

    logger.info(
      `✅ PostgreSQL connected (${isCloudDatabase ? "Neon" : "Local"})`
    );

    client.release();
  } catch (error) {
    logger.error("❌ PostgreSQL connection failed", error);
    process.exit(1);
  }
}

// ===============================
// QUERY HELPER
// ===============================
export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;