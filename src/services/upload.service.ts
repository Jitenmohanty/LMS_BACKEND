// ============================================================================
// FILE: src/services/upload.service.ts
// ============================================================================
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';


export class UploadService {
  async uploadImageToCloudinary(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'learning-platform',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async uploadVideoToCloudinary(file: Express.Multer.File): Promise<{ url: string; publicId: string; duration: number }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'learning-platform/videos',
          resource_type: 'video'
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration
          });
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async uploadPDF(buffer: Buffer, fileName: string): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'learning-platform/certificates',
          resource_type: 'raw', // 'raw' is usually best for PDFs to keep them as is
          public_id: fileName,
          format: 'pdf',
          content_type: 'application/pdf'
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}