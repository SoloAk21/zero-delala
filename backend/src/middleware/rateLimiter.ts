import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError('Too many requests, please try again later', 429, 'RATE_LIMIT_EXCEEDED'));
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 30, // Limit sensitive auth/growth claims to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(
      new AppError(
        'Too many growth reward or authentication attempts, please try again later',
        429,
        'RATE_LIMIT_EXCEEDED'
      )
    );
  }
});
