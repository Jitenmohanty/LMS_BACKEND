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
          resource_type: 'raw',
          public_id: fileName, // fileName should now have .pdf extension
          // format: 'pdf', // Removed: Not applicable for resource_type: 'raw' in this context usually
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

  async uploadPDFFromPath(filePath: string, fileName: string): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          folder: 'learning-platform/certificates',
          resource_type: 'raw', // Force raw to prevent Cloudinary from processing as image
          public_id: fileName,
          use_filename: true,
          unique_filename: false,
          overwrite: true
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
    });
  }
  async generateSignature(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder
      },
      process.env.CLOUDINARY_API_SECRET || ''
    );

    return {
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    };
  }
}