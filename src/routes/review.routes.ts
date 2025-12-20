// ============================================================================
// FILE: src/routes/review.routes.ts
// ============================================================================
import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const reviewController = new ReviewController();

// Add a review (requires auth)
router.post('/', authMiddleware, reviewController.addReview);

// Get reviews for a course (public)
router.get('/:courseId', reviewController.getCourseReviews);

export default router;
