import { logger } from "@logger/logger";
import express from "express";

const createServer = () => {
  const app = express();
  const port = process.env.APP_PORT;

  app.listen(port, () => {
    logger.info("Appliction runninng successfully on port: " + port);
  });

  return app;
};

export default createServer;
