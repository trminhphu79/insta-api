import { Router } from "express";
import { User } from "../../models/user.model";
import { logger } from "@logger/logger";

export function usersRouters() {
  const router = Router();

  router.get("/user", async (_req, res, next) => {
    try {
      logger.info("Start get user list...");
      const users = await User.findAll({
        limit: 100,
        order: [["createdAt", "DESC"]],
      });
      logger.info("Get user success", users);
      res.json(users);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
