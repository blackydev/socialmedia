import express, { Express } from "express";
import logger from "./utils/logger.js";
import routes from "./routes/routes.js";
import helmet from "helmet";
import config from "config";
import mongoose from "mongoose";
import compression from "compression";
import exceptionHandler from "./middleware/exceptionHandler.js";
import migrateDb from "./migrateDb/migrateDb.js";

import {} from "./types/express.js";
const app: Express = express();

if (!config.has("jwtPrivateKey"))
  throw new Error(`FATAL ERROR: jwtPrivateKey property is not defined.`);

// connect to database
if (!config.has("db")) throw new Error(`FATAL ERROR: Database is not defined.`);
const db: string = config.get("db");
mongoose
  .set("strictQuery", true)
  .connect(db)
  .then(() => logger.info(`Connected to ${db}`));

routes(app);
app.use(exceptionHandler);

// production
app.use(helmet());
app.use(compression());

migrateDb(); // if NODE_ENV === "dev"

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Node environment: ${process.env.NODE_ENV}`);
  logger.info(`Listening on port ${port}`);
});

export default server;
