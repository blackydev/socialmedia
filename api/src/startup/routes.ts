import { Express, json } from "express";
import Users from "../routes/users.js";
import Auth from "../routes/auth.js";

export default (app: Express): void => {
  app.use(json());
  app.use("/api/users", Users);
  app.use("/api/auth", Auth);
};
