import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.resolve(__dirname, "../../logs");

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} ${label} ${level}: ${message}`
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.label({ label: `[${process.env.NODE_ENV}] LOG` }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat
      ),
    }),
    new DailyRotateFile({
      dirname: logDir,
      filename: "%DATE%",
      extension: ".log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxSize: "5m",
      maxFiles: "14d",
      auditFile: path.join(logDir, ".audit.json"),
      format: winston.format.combine(logFormat),
    }),
  ],
});
