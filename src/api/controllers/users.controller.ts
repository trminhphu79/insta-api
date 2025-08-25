import { Request, Response, NextFunction } from "express";
import * as svc from "../services/users.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = svc.createUserDto.parse(req.body);
    const user = await svc.createUser(dto);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const u = await svc.getUserById(req.params.id);
    if (!u) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(u);
  } catch (e) {
    next(e);
  }
}

export async function getByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const u = await svc.getUserByUsername(req.params.username);
    if (!u) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(u);
  } catch (e) {
    next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = svc.updateUserDto.parse(req.body);
    const u = await svc.updateUser(req.params.id, dto);
    if (!u) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(u);
  } catch (e) {
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const ok = await svc.deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ message: "NOT_FOUND" });
    res.json({ message: "DELETED" });
  } catch (e) {
    next(e);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 50);
    if (!q) return res.json([]);
    const list = await svc.searchUsers(q, limit);
    res.json(list);
  } catch (e) {
    next(e);
  }
}

export async function stats(req: Request, res: Response, next: NextFunction) {
  try {
    const viewerId = req.query.viewerId
      ? String(req.query.viewerId)
      : undefined;
    const data = await svc.getUserStats(req.params.id, viewerId);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function followers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 100);
    const offset = Math.max(parseInt(String(req.query.offset || "0"), 10), 0);
    const list = await svc.getFollowers(req.params.id, limit, offset);
    res.json(list);
  } catch (e) {
    next(e);
  }
}

export async function following(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 100);
    const offset = Math.max(parseInt(String(req.query.offset || "0"), 10), 0);
    const list = await svc.getFollowing(req.params.id, limit, offset);
    res.json(list);
  } catch (e) {
    next(e);
  }
}
