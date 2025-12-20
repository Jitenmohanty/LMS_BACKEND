// ============================================================================
// FILE: src/routes/admin.routes.ts
// ============================================================================
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const adminController = new AdminController();

// All routes require admin authentication
router.use(authMiddleware, roleMiddleware(['admin']));

// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/block', adminController.blockUser);
router.put('/users/:userId/unblock', adminController.unblockUser);
router.put('/users/:userId/role', adminController.changeUserRole);

// Payment Management
router.get('/payments', adminController.getAllPayments);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

export default router;
