import { Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';
import Progress from '../models/Progress';
import Course from '../models/Course';
import { ApiResponse } from '../utils/apiResponse';
import { UploadService } from '../services/upload.service';

const uploadService = new UploadService();

export class UserController {
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      const { name, bio, addresses } = req.body;

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      // Update basic fields
      if (name) user.name = name;
      if (bio) user.bio = bio;
      if (addresses) user.addresses = addresses;

      // Handle avatar upload if file exists
      if (req.file) {
        try {
          const result = await uploadService.uploadImageToCloudinary(req.file);
          user.avatar = result.url;
        } catch (uploadError: any) {
          return ApiResponse.error(res, 'Failed to upload avatar: ' + uploadError.message, 400);
        }
      }

      await user.save();

      // Return updated user (excluding sensitive data)
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        addresses: user.addresses,
        purchasedCourses: user.purchasedCourses,
        subscriptionPlan: user.subscriptionPlan,
        wishlist: user.wishlist
      };

      ApiResponse.success(res, userResponse, 'Profile updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async getWishlist(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user!._id).populate('wishlist', 'title thumbnail price rating instructor');
      ApiResponse.success(res, { wishlist: user?.wishlist || [] }, 'Wishlist retrieved');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async addToWishlist(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const user = await User.findById(req.user!._id);
      
      if (!user) return ApiResponse.error(res, 'User not found', 404);

      if (!user.wishlist.includes(courseId as any)) {
        user.wishlist.push(courseId as any);
        await user.save();
      }

      ApiResponse.success(res, null, 'Added to wishlist');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async removeFromWishlist(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const user = await User.findById(req.user!._id);

      if (!user) return ApiResponse.error(res, 'User not found', 404);

      user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
      await user.save();

      ApiResponse.success(res, null, 'Removed from wishlist');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      const user = await User.findById(userId);
      const progressList = await Progress.find({ user: userId }).populate('course');

      if (!user) return ApiResponse.error(res, 'User not found', 404);

      // 1. Enrolled Courses
      const enrolledCourses = user.purchasedCourses.length;

      // 2. Certificates & Completion Rate
      let completedCourses = 0;
      let totalProgress = 0;
      let totalLearnedSeconds = 0;

      const recentActivity: any[] = [];

      progressList.forEach((p: any) => {
        if (!p.course) return;

        // Certificates
        if (p.progressPercentage === 100) {
          completedCourses++;
        }

        // Average Completion
        totalProgress += p.progressPercentage;

        // Activity (Inferred)
        recentActivity.push({
          type: p.progressPercentage === 100 ? 'Completed course' : 'In Progress',
          courseTitle: p.course.title,
          date: p.updatedAt
        });

        // Hours Learned Calculation
        // Map all videos in the course to find duration of completed ones
        const courseVideosMap = new Map<string, number>();
        p.course.modules.forEach((m: any) => {
          m.videos.forEach((v: any) => {
            // Store both _id and publicId if uncertain, but usually it's _id
            if (v._id) courseVideosMap.set(v._id.toString(), v.duration || 0);
          });
        });

        p.completedVideos.forEach((vidId: string) => {
          if (courseVideosMap.has(vidId)) {
            totalLearnedSeconds += courseVideosMap.get(vidId) || 0;
          }
        });
      });

      const averageCompletion = progressList.length > 0 ? Math.round(totalProgress / progressList.length) : 0;
      const hoursLearned = Math.round(totalLearnedSeconds / 3600);

      // Sort activity by date desc
      recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const data = {
        enrolledCourses,
        hoursLearned,
        certificates: completedCourses,
        completionRate: averageCompletion,
        recentActivity: recentActivity.slice(0, 5) // Top 5
      };

      ApiResponse.success(res, data, 'Dashboard stats retrieved');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }
}
