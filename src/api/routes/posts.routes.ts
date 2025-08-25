import { Router } from "express";
import * as ctrl from "../controllers/posts.controller";

const r = Router();

r.post("/", ctrl.createPost);
r.get("/:id", ctrl.getPostById);
r.patch("/:id", ctrl.updatePost);
r.delete("/:id", ctrl.deletePost);
r.post("/:id/like", ctrl.likePost);
r.delete("/:id/like", ctrl.unlikePost);

export default r;
