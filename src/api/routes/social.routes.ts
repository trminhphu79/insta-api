import { Router } from "express";
import * as ctrl from "../controllers/social.controller";

const r = Router();

r.post("/follow/:userId", ctrl.followUser);
r.delete("/follow/:userId", ctrl.unfollowUser);
r.get("/feed", ctrl.getHomeFeed);

export default r;
