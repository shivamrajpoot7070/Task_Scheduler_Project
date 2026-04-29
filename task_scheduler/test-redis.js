import 'dotenv/config'; // 🔥 VERY IMPORTANT

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: 1
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

async function test() {
  try {
    await redis.set("test_key", "hello");
    const value = await redis.get("test_key");

    console.log("✅ Redis working:", value);
    process.exit(0);
  } catch (err) {
    console.error("❌ Redis error:", err);
    process.exit(1);
  }
}

test();