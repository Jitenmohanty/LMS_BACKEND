import { z } from 'zod';

export const createOrderSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.string().default('INR'),
  productId: z.string().optional(),
  productType: z.enum(['course', 'bundle', 'subscription']).optional()
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required')
});
