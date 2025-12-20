// ============================================================================
// FILE: src/routes/bundle.routes.ts
// ============================================================================
import { Router } from 'express';
import { BundleController } from '../controllers/bundle.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const bundleController = new BundleController();

router.get('/', bundleController.getAllBundles);
router.get('/:id', bundleController.getBundleById);

router.post('/', authMiddleware, roleMiddleware(['admin']), bundleController.createBundle);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), bundleController.updateBundle);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), bundleController.deleteBundle);

export default router;