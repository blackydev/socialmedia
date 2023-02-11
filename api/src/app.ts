import express, { Express } from "express";
import logger from "./utils/logger.js";
import startup from "./startup.js";
const app: Express = express();
startup(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Node environment: ${process.env.NODE_ENV}`);
  logger.info(`Listening on port ${port}`);
});

export default server;
