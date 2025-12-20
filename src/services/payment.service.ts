// ============================================================================
// FILE: src/services/payment.service.ts
// ============================================================================
import crypto from 'crypto';
import razorpay from '../config/razorpay';
import Payment from '../models/Payment';
import User from '../models/User';
import Course from '../models/Course';

export class PaymentService {
  async createOrder(userId: string, itemType: string, itemId: string, amount: number) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay configuration is missing');
    }
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (integer)
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: userId,
      razorpayOrderId: order.id,
      amount,
      itemType,
      itemId,
      status: 'pending'
    });

    return { order, payment };
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpaySignature;

    if (isValid) {
      const payment = await Payment.findOne({ razorpayOrderId });
      if (!payment) {
        throw new Error('Payment not found');
      }

      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.status = 'success';
      await payment.save();

      // Assign course/bundle to user
      await this.assignPurchaseToUser(payment.user.toString(), payment.itemType, payment.itemId.toString());

      return payment;
    }

    throw new Error('Invalid payment signature');
  }

  async verifyWebhook(body: any, signature: string) {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(JSON.stringify(body))
      .digest('hex');

    return expectedSignature === signature;
  }

  private async assignPurchaseToUser(userId: string, itemType: string, itemId: string) {
    const user = await User.findById(userId);
    if (!user) return;

    if (itemType === 'course') {
      if (!user.purchasedCourses.includes(itemId as any)) {
        user.purchasedCourses.push(itemId as any);
        await user.save();

        // Increment enrollment count
        await Course.findByIdAndUpdate(itemId, { $inc: { enrollmentCount: 1 } });
      }
    } else if (itemType === 'subscription') {
      user.subscriptionPlan = itemId as any;
      await user.save();
    }
  }

  async getAllPayments(filters: any = {}) {
    const query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    return payments;
  }

  async getUserPayments(userId: string) {
    const payments = await Payment.find({ user: userId })
      .populate('itemId', 'title name thumbnail price') // Populates based on refPath
      .sort({ createdAt: -1 });
    return payments;
  }
}
