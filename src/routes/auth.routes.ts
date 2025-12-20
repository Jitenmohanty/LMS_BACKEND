// ============================================================================
// FILE: src/routes/auth.routes.ts
// ============================================================================
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authLimiter } from '../middlewares/rateLimiter.middleware';
import passport from '../config/passport';
import { AuthService } from '../services/auth.service';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, validateBody(registerSchema), authController.register);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.post('/refresh', authController.refresh);
router.post('/logout', authMiddleware, authController.logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req: any, res) => {
  const authService = new AuthService();
  const user = req.user;
  
  const accessToken = require('../utils/jwt').generateAccessToken(user._id.toString(), user.role);
  const refreshToken = require('../utils/jwt').generateRefreshToken(user._id.toString(), user.role);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`);
});

export default router;