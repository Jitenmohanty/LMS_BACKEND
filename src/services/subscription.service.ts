// ============================================================================
// FILE: src/services/subscription.service.ts
// ============================================================================
import SubscriptionPlan from '../models/SubscriptionPlan';
import User from '../models/User';

export class SubscriptionService {
  async getAllPlans() {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ price: 1 });
    return plans;
  }

  async getUserSubscription(userId: string) {
    const user = await User.findById(userId)
      .populate('subscriptionPlan');
    
    return user?.subscriptionPlan || null;
  }

  async createPlan(data: any) {
    const plan = await SubscriptionPlan.create(data);
    return plan;
  }

  async updatePlan(planId: string, data: any) {
    const plan = await SubscriptionPlan.findByIdAndUpdate(planId, data, { new: true });
    if (!plan) {
      throw new Error('Plan not found');
    }
    return plan;
  }

  async deletePlan(planId: string) {
    const plan = await SubscriptionPlan.findByIdAndDelete(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }
    return plan;
  }
}
