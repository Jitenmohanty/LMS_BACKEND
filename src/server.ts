// ============================================================================
// FILE: src/server.ts
// ============================================================================
import 'dotenv/config';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import logger from './utils/logger';
import { errorHandler } from './middlewares/error.middleware';
import { limiter } from './middlewares/rateLimiter.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import routes from './routes';


const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(loggerMiddleware); // Add request logger

app.disable('x-powered-by');

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting
// app.use('/api/', limiter);

// Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;