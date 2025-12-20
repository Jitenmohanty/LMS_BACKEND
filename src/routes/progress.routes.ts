// ============================================================================
// FILE: src/routes/progress.routes.ts
// ============================================================================
import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const progressController = new ProgressController();

router.use(authMiddleware);

router.post('/:courseId/:videoId', progressController.markVideoCompleted);
router.get('/my', progressController.getMyProgress);
router.get('/:courseId', progressController.getCourseProgress);

export default router;