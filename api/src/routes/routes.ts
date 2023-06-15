import { Express, json } from "express";
import config from "config";
import cors from "cors";
import users from "./users.js";
import auth from "./auth.js";
import posts from "./posts.js";

export default (app: Express): void => {
  app.use(json());
  app.use(
    cors({
      origin: config.get("webIP"),
      credentials: true,
    }),
  );
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/posts", posts);
};
