// ============================================================================
// FILE: src/middlewares/validate.middleware.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../utils/apiResponse';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      ApiResponse.error(res, 'Validation error', 400, error.errors);
    }
  };
};