import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const errorCode = isAppError ? err.errorCode : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const details = isAppError ? err.details : undefined;

  if (statusCode >= 500) {
    logger.error(`[${req.method} ${req.url}] ${err.stack || err.message}`);
  } else {
    logger.warn(`[${req.method} ${req.url}] Status ${statusCode} - ${message}`);
  }

  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details !== undefined ? { details } : {})
    }
  };

  res.status(statusCode).json(response);
};
