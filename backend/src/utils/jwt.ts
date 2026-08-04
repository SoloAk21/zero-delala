import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from './AppError.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'zero_delala_default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export interface JwtUserPayload {
  userId: string;
  telegramId: string;
  role: string;
}

export const generateToken = (payload: JwtUserPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn']
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtUserPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('JWT token has expired', 401, 'TOKEN_EXPIRED');
    }
    throw new AppError('Invalid JWT token', 401, 'INVALID_TOKEN');
  }
};
