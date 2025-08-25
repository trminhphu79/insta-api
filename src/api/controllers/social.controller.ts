import { Request, Response, NextFunction } from "express";
import * as svc from "../services/social.service";

export async function followUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { me } = req.body as { me: string };
    const followingId = req.params.userId;
    const out = await svc.followUser(me, followingId);
    if (!out.ok)
      return res.status(out.code || 404).json({ message: out.message });
    res.json({ following: true });
  } catch (e) {
    next(e);
  }
}

export async function unfollowUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { me } = req.body as { me: string };
    const followingId = req.params.userId;
    await svc.unfollowUser(me, followingId);
    res.json({ following: false });
  } catch (e) {
    next(e);
  }
}

export async function getHomeFeed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const me = String(req.query.me);
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 50);
    const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : null;
    const result = await svc.getHomeFeed({ me, limit, cursor });
    res.json(result);
  } catch (e) {
    next(e);
  }
}
