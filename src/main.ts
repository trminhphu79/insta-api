import { initializeRoutes } from "./api/routes/index.routes";
import configs from "@configs/env.config";
import { logger } from "@logger/logger";
import { User } from "@models/user.model";
import createServer from "./server";
import { createSequelizeService } from "@services/postgres.service";
import { createRedisService } from "@services/redis.service";

const db = createSequelizeService(configs.db);
const redis = createRedisService(configs.redis);

async function bootstrapApplication() {
  const app = createServer();

  await Promise.all([db.connect([User]), redis.connect()]);
  await db.sync({ alter: true });
  await initializeRoutes(app);
  await checkHealth();
  
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function checkHealth() {
  const [pgOk, rdOk] = await Promise.all([db.health(), redis.health()]);
  logger.info("Health:", { postgres: pgOk, redis: rdOk });
}
async function shutdown() {
  logger.info("Shutting down...");
  await Promise.allSettled([db.close(), redis.close()]);
  process.exit(0);
}

bootstrapApplication().catch((err) => {
  logger.error("Boot failed:", err);
  process.exit(1);
});
