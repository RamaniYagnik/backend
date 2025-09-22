import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import logger from "../utils/logger.js";

const sequelize = new Sequelize(process.env.DB_NAME, "root", process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

try {
  await sequelize.authenticate();
  logger.info("✅ Connected to MySQL with Sequelize!");
} catch (error) {
  logger.error("❌ Unable to connect to the database:", error);
}

export default sequelize;
