// ============================================================================
// FILE: src/routes/payment.routes.ts
// ============================================================================
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/create-order', authMiddleware, paymentController.createOrder);
router.post('/verify', authMiddleware, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

router.get('/history', authMiddleware, roleMiddleware(['admin']), paymentController.getAllPayments);
router.get('/my', authMiddleware, paymentController.getMyPayments);

export default router;