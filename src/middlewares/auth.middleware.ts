// ============================================================================
// FILE: src/middlewares/auth.middleware.ts
// ============================================================================
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { ApiResponse } from '../utils/apiResponse';
import User from '../models/User';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponse.error(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    if (user.isBlocked) {
      ApiResponse.error(res, 'Account is blocked', 403);
      return;
    }

    const userObj = user.toObject();
    req.user = {
      ...userObj,
      _id: userObj._id.toString(),
      purchasedCourses: userObj.purchasedCourses.map((id) => id.toString()),
      subscriptionPlan: userObj.subscriptionPlan?.toString(),
    };
    next();
  } catch (error) {
    ApiResponse.error(res, 'Invalid or expired token', 401);
  }
};

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);

    if (user && !user.isBlocked) {
      const userObj = user.toObject();
      req.user = {
        ...userObj,
        _id: userObj._id.toString(),
        purchasedCourses: userObj.purchasedCourses.map((id) => id.toString()),
        subscriptionPlan: userObj.subscriptionPlan?.toString(),
      };
    }
    next();
  } catch (error) {
    // If token is invalid, just proceed as guest
    next();
  }
};