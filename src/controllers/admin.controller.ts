// ============================================================================
// FILE: src/controllers/admin.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { ApiResponse } from '../utils/apiResponse';
import User from '../models/User';
import Course from '../models/Course';
import Payment from '../models/Payment';

export class AdminController {
  // User Management
  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-password -refreshTokens')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      ApiResponse.success(res, {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async blockUser(req: AuthRequest, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isBlocked: true },
        { new: true }
      );

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      ApiResponse.success(res, { user }, 'User blocked successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async unblockUser(req: AuthRequest, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isBlocked: false },
        { new: true }
      );

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      ApiResponse.success(res, { user }, 'User unblocked successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async changeUserRole(req: AuthRequest, res: Response) {
    try {
      const { role } = req.body;

      if (!['user', 'instructor', 'admin'].includes(role)) {
        return ApiResponse.error(res, 'Invalid role', 400);
      }

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true }
      );

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      ApiResponse.success(res, { user }, 'User role updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  // Payment Management
  async getAllPayments(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      const payments = await Payment.find()
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Payment.countDocuments();

      // Calculate revenue
      const revenue = await Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      ApiResponse.success(res, {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        revenue: revenue[0]?.total || 0
      });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  // Analytics
  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const publishedCourses = await Course.countDocuments({ status: 'published' });
      
      const revenueResult = await Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const recentUsers = await User.find()
        .select('name email createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

      const topCourses = await Course.find({ status: 'published' })
        .sort({ enrollmentCount: -1 })
        .limit(5)
        .select('title enrollmentCount rating');

      ApiResponse.success(res, {
        stats: {
          totalUsers,
          totalCourses,
          publishedCourses,
          totalRevenue: revenueResult[0]?.total || 0
        },
        recentUsers,
        topCourses
      });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }
}