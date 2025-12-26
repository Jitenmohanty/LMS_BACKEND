// ============================================================================
// FILE: src/services/review.service.ts
// ============================================================================
import Review from '../models/Review';
import Course from '../models/Course';
import mongoose from 'mongoose';

import User from '../models/User';

export class ReviewService {
  async addReview(userId: string, courseId: string, rating: number, comment: string) {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if user purchased the course
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Check if user is admin (admins can review any course) or if they purchased it
    const isAdmin = user.role === 'admin';
    const hasPurchased = user.purchasedCourses.some(id => id.toString() === courseId);

    if (!isAdmin && !hasPurchased) {
        throw new Error('You must purchase the course to leave a review');
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

  async addReply(reviewId: string, replyText: string) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    review.reply = replyText;
    review.replyAt = new Date();
    review.isReplied = true;
    await review.save();
    
    return review;
  }

  async deleteReview(reviewId: string) {
      const review = await Review.findByIdAndDelete(reviewId);
      if (!review) {
          throw new Error('Review not found');
      }
      
      // Recalculate average rating
      await this.calculateAverageRating(review.course.toString());
      
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
