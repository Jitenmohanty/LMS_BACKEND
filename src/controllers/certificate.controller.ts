import { Response } from 'express';
import { AuthRequest } from '../types';
import { CertificateService } from '../services/certificate.service';
import { ApiResponse } from '../utils/apiResponse';

const certificateService = new CertificateService();

export class CertificateController {
  async getMyCertificates(req: AuthRequest, res: Response) {
    try {
      const certificates = await certificateService.getUserCertificates(req.user!._id);
      ApiResponse.success(res, { certificates });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async downloadCertificate(req: AuthRequest, res: Response) {
    try {
      const { certificateId } = req.params;
      const doc = await certificateService.getCertificateStream(certificateId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`);

      doc.pipe(res);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 404);
    }
  }
  async getAllCertificates(req: AuthRequest, res: Response) {
    try {
      const certificates = await certificateService.getAllCertificates();
      ApiResponse.success(res, { certificates });
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }
}
