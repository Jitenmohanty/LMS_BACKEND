// ============================================================================
// FILE: src/routes/payment.routes.ts
// ============================================================================
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

import { validateBody } from '../middlewares/validate.middleware';
import { createOrderSchema, verifyPaymentSchema } from '../validators/payment.validator';

const router = Router();
const paymentController = new PaymentController();

router.post('/create-order', authMiddleware, validateBody(createOrderSchema), paymentController.createOrder);
router.post('/verify', authMiddleware, validateBody(verifyPaymentSchema), paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

router.get('/history', authMiddleware, roleMiddleware(['admin']), paymentController.getAllPayments);
router.get('/my', authMiddleware, paymentController.getMyPayments);

export default router;