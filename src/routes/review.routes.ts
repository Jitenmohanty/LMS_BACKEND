// ============================================================================
// FILE: src/routes/review.routes.ts
// ============================================================================
import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

import { validateBody } from '../middlewares/validate.middleware';
import { addReviewSchema, addReplySchema } from '../validators/review.validator';

import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const reviewController = new ReviewController();

// Add a review (requires auth)
router.post('/', authMiddleware, validateBody(addReviewSchema), reviewController.addReview);

// Reply to a review (Admin only)
router.post('/:reviewId/reply', authMiddleware, roleMiddleware(['admin']), validateBody(addReplySchema), reviewController.addReply);

// Delete a review (Admin only)
router.delete('/:reviewId', authMiddleware, roleMiddleware(['admin']), reviewController.deleteReview);

// Get reviews for a course (public)
router.get('/:courseId', reviewController.getCourseReviews);

export default router;
