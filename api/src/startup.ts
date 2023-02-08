import { Express } from "express";
import checkConfig from "./startup/checkConfig.js";
import mongodb from "./startup/db.js";
import routes from "./startup/routes.js";
import production from "./startup/production.js";

export default (app: Express): void => {
  checkConfig();
  mongodb();
  routes(app);
  production(app);
};
