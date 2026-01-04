// ============================================================================
// FILE: src/routes/upload.routes.ts
// ============================================================================
import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const uploadController = new UploadController();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

router.use(authMiddleware, roleMiddleware(['admin']));

router.post('/image', upload.single('file'), uploadController.uploadImage);
router.post('/video', upload.single('file'), uploadController.uploadVideo);
router.get('/signature', uploadController.getUploadSignature);

export default router;
