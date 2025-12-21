// ============================================================================
// FILE: src/controllers/auth.controller.ts
// ============================================================================
import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      ApiResponse.success(res, {
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        },
        accessToken: result.accessToken
      }, 'Registration successful', 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      ApiResponse.success(res, {
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        },
        accessToken: result.accessToken
      }, 'Login successful');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 401);
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      ApiResponse.success(res, { user: req.user }, 'User retrieved successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return ApiResponse.error(res, 'No refresh token provided', 401);
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      ApiResponse.success(res, { accessToken: result.accessToken }, 'Token refreshed');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 401);
    }
  }

  async logout(req: AuthRequest, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (req.user && refreshToken) {
        await authService.logout(req.user._id, refreshToken);
      }

      res.clearCookie('refreshToken');
      ApiResponse.success(res, null, 'Logout successful');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyEmail(email, otp);
      ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async resendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.resendOTP(email);
      ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword(email, otp, newPassword);
      ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user!._id, oldPassword, newPassword);
      ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }
}