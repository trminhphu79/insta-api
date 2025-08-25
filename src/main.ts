import api from "./api/routes/index.routes";
import { logger } from "@logger/logger";
import { User, Post, PostMedia, Comment, Like, Follow } from "@models/index";
import createServer from "./server";
import { db } from "@services/postgres.service";
import { redis } from "@services/redis.service";
import { setupSwagger } from "./docs/swagger";

async function bootstrapApplication() {
  const app = createServer();

  await Promise.all([
    db.connect([User, Post, PostMedia, Comment, Like, Follow]),
    redis.connect(),
  ]);

  await db.sync({ alter: true });

  await checkHealth();

  app.use("/api", api);

  setupSwagger(app);

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
