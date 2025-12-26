// ============================================================================
// FILE: src/routes/admin.routes.ts
// ============================================================================
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { changeUserRoleSchema, grantCourseAccessSchema, revokeCourseAccessSchema } from '../validators/admin.validator';

const router = Router();
const adminController = new AdminController();

// All routes require admin authentication
router.use(authMiddleware, roleMiddleware(['admin']));

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/block', adminController.blockUser);
router.put('/users/:userId/unblock', adminController.unblockUser);
router.put('/users/:userId/role', validateBody(changeUserRoleSchema), adminController.changeUserRole);
router.post('/users/:userId/courses/:courseId/grant', validateParams(grantCourseAccessSchema), adminController.grantCourseAccess);
router.post('/users/:userId/courses/:courseId/revoke', validateParams(revokeCourseAccessSchema), adminController.revokeCourseAccess);

// Payment Management
router.get('/payments', adminController.getAllPayments);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

export default router;
