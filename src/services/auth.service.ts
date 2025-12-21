// ============================================================================
// FILE: src/services/auth.service.ts
// ============================================================================
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { EmailService } from './email.service';
import crypto from 'crypto';

const emailService = new EmailService();

export class AuthService {
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const otp = this.generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({ 
      email, 
      password, 
      name, 
      role: 'user',
      isVerified: false,
      otp,
      otpExpires
    });

    // Send OTP Email
    await emailService.sendOTP(email, otp, 'verification');

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    user.refreshTokens.push(refreshToken);
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
        return { message: 'Email already verified' };
    }

    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async resendOTP(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    if (user.isVerified) throw new Error('Email already verified');

    const otp = this.generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await emailService.sendOTP(email, otp, 'verification');
    return { message: 'OTP sent successfully' };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const otp = this.generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await emailService.sendOTP(email, otp, 'reset');
    return { message: 'OTP sent to your email' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) throw new Error('User not found');

    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error('User not found');

    const isMatch = await user.comparePassword(oldPass);
    if (!isMatch) throw new Error('Incorrect current password');

    user.password = newPass;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    user.refreshTokens.push(refreshToken);
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString(), user.role);

    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, refreshToken: string) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      await user.save();
    }
  }
}
