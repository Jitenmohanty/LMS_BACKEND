import { Router } from 'express';
import multer from 'multer';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { updateProfileSchema, addToWishlistSchema } from '../validators/user.validator';

const router = Router();
const userController = new UserController();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.use(authMiddleware);

router.get('/dashboard', userController.getDashboardStats);
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:courseId', validateParams(addToWishlistSchema), userController.addToWishlist);
router.delete('/wishlist/:courseId', userController.removeFromWishlist);

router.put('/profile', upload.single('avatar'), validateBody(updateProfileSchema), userController.updateProfile);

export default router;
