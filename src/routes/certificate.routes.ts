import express from 'express';
import { CertificateController } from '../controllers/certificate.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

import { roleMiddleware } from '../middlewares/role.middleware';

import { validateParams } from '../middlewares/validate.middleware';
import { downloadCertificateSchema } from '../validators/certificate.validator';

const router = express.Router();
const certificateController = new CertificateController();

router.use(authMiddleware);

router.get('/', certificateController.getMyCertificates);
router.get('/:certificateId/download', validateParams(downloadCertificateSchema), certificateController.downloadCertificate);

// Admin Routes
router.get('/all', roleMiddleware(['admin']), certificateController.getAllCertificates);

export default router;
