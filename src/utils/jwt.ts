// ============================================================================
// FILE: src/utils/jwt.ts
// ============================================================================
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

export const generateAccessToken = (userId: string, role: string): string => {
  const secret: jwt.Secret = process.env.JWT_ACCESS_SECRET || '';
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as any
  };
  return jwt.sign({ userId, role }, secret, options);
};

export const generateRefreshToken = (userId: string, role: string): string => {
  const secret: jwt.Secret = process.env.JWT_REFRESH_SECRET || '';
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any
  };
  return jwt.sign({ userId, role }, secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || '') as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || '') as TokenPayload;
};