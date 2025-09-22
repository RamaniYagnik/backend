// utils/logger.js
import winston from "winston";

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create logger
const logger = winston.createLogger({
  level: "info", // default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // capture error stack
    winston.format.splat(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({ // logs to console
      level: "debug", // more detailed logs for dev
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// If not in production, log to console as well
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    })
  );
}

export default logger;
