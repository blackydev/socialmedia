import { Express } from "express";
import helmet from "helmet";
import compression from "compression";

export default (app: Express): void => {
  app.use(helmet());
  app.use(compression());
};
