// ============================================================================
// FILE: src/controllers/subscription.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { SubscriptionService } from '../services/subscription.service';
import { ApiResponse } from '../utils/apiResponse';

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  async getAllPlans(req: AuthRequest, res: Response) {
    try {
      const plans = await subscriptionService.getAllPlans();
      ApiResponse.success(res, { plans });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async getMySubscription(req: AuthRequest, res: Response) {
    try {
      const subscription = await subscriptionService.getUserSubscription(req.user!._id);
      ApiResponse.success(res, { subscription });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async createPlan(req: AuthRequest, res: Response) {
    try {
      const plan = await subscriptionService.createPlan(req.body);
      ApiResponse.success(res, { plan }, 'Plan created successfully', 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async updatePlan(req: AuthRequest, res: Response) {
    try {
      const plan = await subscriptionService.updatePlan(req.params.id, req.body);
      ApiResponse.success(res, { plan }, 'Plan updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async deletePlan(req: AuthRequest, res: Response) {
    try {
      await subscriptionService.deletePlan(req.params.id);
      ApiResponse.success(res, null, 'Plan deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }
}