import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "../services/posts.service";

const createPostSchema = z.object({
  authorId: z.string().uuid(),
  caption: z.string().nullable().optional(),
  visibility: z.enum(["public", "followers"]).default("public"),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
        position: z.number().int().min(0).default(0),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
      })
    )
    .default([]),
});

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createPostSchema.parse(req.body);
    const post = await svc.createPost(dto);
    res.json(post);
  } catch (e) {
    next(e);
  }
}

export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await svc.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(post);
  } catch (e) {
    next(e);
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await svc.updatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(post);
  } catch (e) {
    next(e);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ok = await svc.deletePost(req.params.id);
    if (!ok) return res.status(404).json({ message: "NOT_FOUND" });
    res.json({ message: "DELETED" });
  } catch (e) {
    next(e);
  }
}

export async function likePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.body as { userId: string };
    const result = await svc.likePost(req.params.id, userId);
    if (!result) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function unlikePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.body as { userId: string };
    const result = await svc.unlikePost(req.params.id, userId);
    if (!result) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(result);
  } catch (e) {
    next(e);
  }
}
