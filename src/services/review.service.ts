// ============================================================================
// FILE: src/services/review.service.ts
// ============================================================================
import Review from '../models/Review';
import Course from '../models/Course';
import mongoose from 'mongoose';

export class ReviewService {
  async addReview(userId: string, courseId: string, rating: number, comment: string) {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Create review
    const review = await Review.create({
      user: userId,
      course: courseId,
      rating,
      comment
    });

    // Update course average rating
    await this.calculateAverageRating(courseId);

    return review;
  }

  async getReviewsByCourse(courseId: string) {
    return await Review.find({ course: courseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
  }

  private async calculateAverageRating(courseId: string) {
    const stats = await Review.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: '$course',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Course.findByIdAndUpdate(courseId, {
        rating: stats[0].averageRating
        // Could also store numReviews if we added that field to Course model
      });
    } else {
      await Course.findByIdAndUpdate(courseId, { rating: 0 });
    }
  }
}
