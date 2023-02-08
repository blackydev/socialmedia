import logger from "../utils/logger.js";
import mongoose from "mongoose";
import config from "config";

export default (): void => {
  const db: string = config.get("db");
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
};
