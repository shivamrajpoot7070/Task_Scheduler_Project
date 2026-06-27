import Redis from "ioredis";
import env from "./env.js";
import logger from "../common/logger.js";

// ===============================
// CREATE REDIS CLIENT
// ===============================
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 2000);
    return delay;
  }
});

redis.on("connect", () => {
  logger.info("✅ Redis connected");
});

redis.on("error", (err) => {
  logger.error("❌ Redis error", err);
});

redis.on("reconnecting", () => {
  logger.warn("⚠️ Redis reconnecting...");
});


await redis.set("ping", "pong");
const val = await redis.get("ping");
console.log(val);

// ===============================
// EXPORT
// ===============================
export default redis;