// ============================================================================
// FILE: src/utils/logger.ts
// ============================================================================
import winston from 'winston';
import 'winston-mongodb';

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Console Format
const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  colorize(),
  printf(({ level, message, timestamp, meta }: any) => {
    let metaStr = '';
    if (meta && Object.keys(meta).length > 0) {
      metaStr = JSON.stringify(meta);
    }
    return `[${timestamp}] ${level}: ${message} ${metaStr}`;
  })
);

// MongoDB Transport
const mongoTransport = new winston.transports.MongoDB({
  level: 'info',
  db: process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db',
  collection: 'logs',
  options: { useUnifiedTopology: true },
  format: combine(timestamp(), json())
});

// Create Logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }), // Log stack trace for errors
    timestamp(),
    json()
  ),
  defaultMeta: { service: 'lms-backend' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

// Add MongoDB transport only if URI is present (and not in test mode)
if (process.env.MONGO_URI && process.env.NODE_ENV !== 'test') {
  logger.add(mongoTransport);
}

export default logger;