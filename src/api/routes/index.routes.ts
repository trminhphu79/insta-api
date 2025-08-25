import { Router } from "express";
import posts from "./posts.routes";
import comments from "./comments.routes";
import social from "./social.routes";
import users from "./users.routes";

const api = Router();
api.use("/users", users);
api.use("/posts", posts);
api.use("/comments", comments);
api.use("/social", social);

export default api;
