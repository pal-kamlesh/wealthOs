// logger.js
import winston from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // captures stack traces on errors
    logFormat
  ),
  transports: [
    // Console — colorized, for development
    new winston.transports.Console({
      format: combine(colorize({ all: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),

    // // Daily rotating file — all info+ logs
    // new DailyRotateFile({
    //   filename: "logs/app-%DATE%.log",
    //   datePattern: "YYYY-MM-DD",
    //   maxFiles: "14d", // keep last 14 days
    //   level: "info",
    // }),

    // // Separate file for errors only
    // new DailyRotateFile({
    //   filename: "logs/error-%DATE%.log",
    //   datePattern: "YYYY-MM-DD",
    //   maxFiles: "30d",
    //   level: "error",
    // }),
  ],
});

export default logger;