import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "../services/comments.service";

const createCommentSchema = z.object({
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
  body: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createCommentSchema.parse(req.body);
    const c = await svc.createComment(dto);
    if (!c) return res.status(404).json({ message: "POST_NOT_FOUND" });
    res.json(c);
  } catch (e) {
    next(e);
  }
}

export async function getCommentsByPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const list = await svc.getCommentsByPost(req.params.postId);
    res.json(list);
  } catch (e) {
    next(e);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ok = await svc.deleteComment(req.params.id);
    if (!ok) return res.status(404).json({ message: "NOT_FOUND" });
    res.json({ message: "DELETED" });
  } catch (e) {
    next(e);
  }
}
