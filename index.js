import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import sequelize from "./config/db.js";
import cors from "cors";
import logger from "./utils/logger.js";
import helmet from "helmet";
import allRoutes from "./routes/allRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(express.json());
app.use(morgan("dev")); 
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use("/uploads", express.static("uploads"));
app.use("/api/v1", allRoutes);

// DB connection + sync
try {
  await sequelize.authenticate();
  logger.info("✅ Database connected");

  await sequelize.sync();
  logger.info("✅ Tables synced");
} catch (err) {
  logger.error("❌ DB Error:",err);
}

app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
