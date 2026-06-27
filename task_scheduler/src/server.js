import "dotenv/config";

import app from "./app.js";
import logger from "./common/logger.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { verifyMailer } from "./services/mail.service.js";
import "./config/redis.js"; // just importing initializes Redis

const PORT = env.PORT;

async function startServer() {
  try {
    // Connect DB
    await verifyMailer();
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server", error);
    process.exit(1);
  }
}

startServer();