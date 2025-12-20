// ============================================================================
// FILE: src/types/index.ts
// ============================================================================
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  _id: string;
  email: string;
  password?: string;
  name: string;
  role: 'user' | 'instructor' | 'admin';
  avatar?: string;
  googleId?: string;
  refreshTokens: string[];
  isBlocked: boolean;
  purchasedCourses: string[];
  subscriptionPlan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}