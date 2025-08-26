import { Router } from "express";
import express from "express";
import posts from "./posts.routes";
import comments from "./comments.routes";
import social from "./social.routes";
import users from "./users.routes";
import { logger } from "@logger/logger";

const api = Router();
api.use("/users", users);
api.use("/posts", posts);
api.use("/comments", comments);
api.use("/social", social);

api.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {

    const status = err.status || 500;
    const message = err.message || "SERVER_ERROR";
    logger.error(message);

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
);

export default api;
