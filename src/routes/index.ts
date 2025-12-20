// ============================================================================
// FILE: src/routes/index.ts
// ============================================================================
import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';
import bundleRoutes from './bundle.routes';
import progressRoutes from './progress.routes';
import uploadRoutes from './upload.routes';
import subscriptionRoutes from './subscription.routes';
import userRoutes from './user.routes';
import reviewRoutes from './review.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/bundles', bundleRoutes);
router.use('/progress', progressRoutes);
router.use('/upload', uploadRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);

export default router;