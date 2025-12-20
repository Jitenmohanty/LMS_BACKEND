// ============================================================================
// FILE: src/middlewares/logger.middleware.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AuthRequest } from '../types';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const authReq = req as AuthRequest;
    
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: duration,
      userId: authReq.user ? authReq.user._id : 'anonymous',
      ip: req.ip
    };

    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(message, { meta });
    } else if (res.statusCode >= 400) {
      logger.warn(message, { meta });
    } else {
      logger.info(message, { meta });
    }
  });

  next();
};
