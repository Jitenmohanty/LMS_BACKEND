// ============================================================================
// FILE: src/controllers/review.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { ReviewService } from '../services/review.service';
import { ApiResponse } from '../utils/apiResponse';

const reviewService = new ReviewService();

export class ReviewController {
  async addReview(req: AuthRequest, res: Response) {
    try {
      const { courseId, rating, comment } = req.body;
      
      // Basic validation
      if (!courseId || !rating || !comment) {
        return ApiResponse.error(res, 'Missing required fields', 400);
      }

      const review = await reviewService.addReview(req.user!._id, courseId, rating, comment);
      ApiResponse.success(res, { review }, 'Review added successfully', 201);
    } catch (error: any) {
        // Handle duplicate key error (user already reviewed course)
        if (error.code === 11000) {
            return ApiResponse.error(res, 'You have already reviewed this course', 400);
        }
        ApiResponse.error(res, error.message, 400);
    }
  }

  async getCourseReviews(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const reviews = await reviewService.getReviewsByCourse(courseId);
      ApiResponse.success(res, { reviews }, 'Reviews retrieved successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }
}
