import pkg from "pg";
import env from "./env.js";
import logger from "../common/logger.js";

const { Pool } = pkg;

// ===============================
// CREATE POOL
// ===============================
const pool = new Pool({
  connectionString: env.DATABASE_URL || undefined,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,

  max: 10, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// ===============================
// CONNECT FUNCTION
// ===============================
export async function connectDB() {
  try {
    const client = await pool.connect();

    logger.info("✅ PostgreSQL connected");

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