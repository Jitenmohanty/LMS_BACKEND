// ============================================================================
// FILE: src/controllers/progress.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { ProgressService } from '../services/progress.service';
import { ApiResponse } from '../utils/apiResponse';

const progressService = new ProgressService();

export class ProgressController {
  async markVideoCompleted(req: AuthRequest, res: Response) {
    try {
      const { courseId, videoId } = req.params;
      const progress = await progressService.markVideoCompleted(
        req.user!._id,
        courseId,
        videoId
      );
      ApiResponse.success(res, { progress }, 'Progress updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async getMyProgress(req: AuthRequest, res: Response) {
    try {
      const progress = await progressService.getUserProgress(req.user!._id);
      ApiResponse.success(res, { progress });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async getCourseProgress(req: AuthRequest, res: Response) {
    try {
      const progress = await progressService.getCourseProgress(
        req.user!._id,
        req.params.courseId
      );
      ApiResponse.success(res, { progress });
    } catch (error: any) {
      ApiResponse.error(res, error.message, 404);
    }
  }
}