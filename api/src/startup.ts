import { Express } from "express";
import checkConfig from "./startup/checkConfig.js";
import mongodb from "./startup/db.js";
import routes from "./startup/routes.js";
import production from "./startup/production.js";
import {} from "./types/express.js";
import exceptionHandler from "./startup/exceptionHandler.js";
import dev from "./startup/dev.js";

export default (app: Express): void => {
  checkConfig();
  mongodb();
  routes(app);
  app.use(exceptionHandler);
  production(app);
  dev();
};
