import winston from 'winston';
import path from 'path';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'app.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
