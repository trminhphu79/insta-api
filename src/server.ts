import { logger } from "@logger/logger";
import express from "express";
import cors from "cors";

const createServer = () => {
  const app = express();
  const port = process.env.APP_PORT;
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.listen(port, () => {
    logger.info("Appliction runninng successfully on port: " + port);
  });

  return app;
};

export default createServer;
