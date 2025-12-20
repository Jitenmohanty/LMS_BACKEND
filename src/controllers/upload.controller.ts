// ============================================================================
// FILE: src/controllers/upload.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { UploadService } from '../services/upload.service';
import { ApiResponse } from '../utils/apiResponse';

const uploadService = new UploadService();

export class UploadController {
  async uploadImage(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'No file uploaded', 400);
      }

      const result = await uploadService.uploadImageToCloudinary(req.file);
      ApiResponse.success(res, result, 'Image uploaded successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async uploadVideo(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'No file uploaded', 400);
      }

      const result = await uploadService.uploadVideoToCloudinary(req.file);
      ApiResponse.success(res, result, 'Video uploaded successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }


}