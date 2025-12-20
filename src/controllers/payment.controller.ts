// ============================================================================
// FILE: src/controllers/payment.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { PaymentService } from '../services/payment.service';
import { ApiResponse } from '../utils/apiResponse';

const paymentService = new PaymentService();

export class PaymentController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay keys are missing in environment variables');
      }

      const { itemType, itemId, amount } = req.body;
      // console.log('Creating order for:', { userId: req.user?._id, itemType, itemId, amount });
      
      const result = await paymentService.createOrder(req.user!._id, itemType, itemId, amount);
      ApiResponse.success(res, result, 'Order created successfully', 201);
    } catch (error: any) {
      console.error('Error in createOrder:', error);
      ApiResponse.error(res, error.message || 'Error creating order', 400, error);
    }
  }

  async verifyPayment(req: AuthRequest, res: Response) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const payment = await paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      ApiResponse.success(res, { payment }, 'Payment verified successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async handleWebhook(req: AuthRequest, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const isValid = await paymentService.verifyWebhook(req.body, signature);

      if (!isValid) {
        return ApiResponse.error(res, 'Invalid webhook signature', 400);
      }

      // Process webhook event
      ApiResponse.success(res, null, 'Webhook processed');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async getAllPayments(req: AuthRequest, res: Response) {
    try {
      const payments = await paymentService.getAllPayments(req.query);
      ApiResponse.success(res, { payments }, 'All payments retrieved');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async getMyPayments(req: AuthRequest, res: Response) {
    try {
      const payments = await paymentService.getUserPayments(req.user!._id);
      ApiResponse.success(res, { payments }, 'User payments retrieved');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }
}