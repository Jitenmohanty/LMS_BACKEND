// ============================================================================
// FILE: src/middlewares/role.middleware.ts
// ============================================================================
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ApiResponse } from '../utils/apiResponse';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 'Unauthorized', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ApiResponse.error(res, 'Insufficient permissions', 403);
      return;
    }

    next();
  };
};