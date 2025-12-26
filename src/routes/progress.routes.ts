// ============================================================================
// FILE: src/routes/progress.routes.ts
// ============================================================================
import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

import { validateBody } from '../middlewares/validate.middleware';
import { updateHeartbeatSchema, markVideoCompletedSchema } from '../validators/progress.validator';

const router = Router();
const progressController = new ProgressController();

router.use(authMiddleware);

// Order matters: specific routes before parameter routes like /:courseId
router.get('/continue-learning', progressController.getContinueLearning);
router.post('/heartbeat/:courseId/:videoId', validateBody(updateHeartbeatSchema), progressController.updateHeartbeat);

router.post('/:courseId/:videoId', validateBody(markVideoCompletedSchema), progressController.markVideoCompleted);
router.get('/my', progressController.getMyProgress);
router.get('/:courseId', progressController.getCourseProgress);

export default router;