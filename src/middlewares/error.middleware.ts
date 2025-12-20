// ============================================================================
// FILE: src/middlewares/error.middleware.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  ApiResponse.error(res, message, statusCode, err.errors);
};
