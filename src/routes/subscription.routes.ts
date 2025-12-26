// ============================================================================
// FILE: src/routes/subscription.routes.ts
// ============================================================================
import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

import { validateBody } from '../middlewares/validate.middleware';
import { createPlanSchema, updatePlanSchema } from '../validators/subscription.validator';

const router = Router();
const subscriptionController = new SubscriptionController();

router.get('/plans', subscriptionController.getAllPlans);
router.get('/my', authMiddleware, subscriptionController.getMySubscription);
router.post('/plans', authMiddleware, roleMiddleware(['admin']), validateBody(createPlanSchema), subscriptionController.createPlan);
router.put('/plans/:id', authMiddleware, roleMiddleware(['admin']), validateBody(updatePlanSchema), subscriptionController.updatePlan);
router.delete('/plans/:id', authMiddleware, roleMiddleware(['admin']), subscriptionController.deletePlan);

export default router;