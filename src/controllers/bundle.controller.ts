// ============================================================================
// FILE: src/controllers/bundle.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { BundleService } from '../services/bundle.service';
import { ApiResponse } from '../utils/apiResponse';

const bundleService = new BundleService();

export class BundleController {
  async createBundle(req: AuthRequest, res: Response) {
    try {
      const bundle = await bundleService.createBundle(req.body);
      ApiResponse.success(res, { bundle }, 'Bundle created successfully', 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async getAllBundles(req: AuthRequest, res: Response) {
    try {
      const bundles = await bundleService.getAllBundles();
      ApiResponse.success(res, { bundles });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async getBundleById(req: AuthRequest, res: Response) {
    try {
      const bundle = await bundleService.getBundleById(req.params.id);
      ApiResponse.success(res, { bundle });
    } catch (error: any) {
      ApiResponse.error(res, error.message, 404);
    }
  }

  async updateBundle(req: AuthRequest, res: Response) {
    try {
      const bundle = await bundleService.updateBundle(req.params.id, req.body);
      ApiResponse.success(res, { bundle }, 'Bundle updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async deleteBundle(req: AuthRequest, res: Response) {
    try {
      await bundleService.deleteBundle(req.params.id);
      ApiResponse.success(res, null, 'Bundle deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 404);
    }
  }
}
