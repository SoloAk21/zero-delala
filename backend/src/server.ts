import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { z } from 'zod';
import { ETHIOPIAN_REGIONS } from '@zero-delala/shared';
import { logger } from './utils/logger.js';
import { AppError } from './utils/AppError.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validateRequest } from './middleware/validateRequest.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Express HTTP request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`HTTP ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  logger.info('Health check probe requested');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supportedRegions: ETHIOPIAN_REGIONS.length
  });
});

// Test Zod Schema
const testSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long'),
    price: z.number().positive('Price must be a positive number'),
    region: z.string().min(1, 'Region is required')
  })
});

// Validation Test Endpoint
app.post('/validation-test', validateRequest(testSchema), (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Payload validated successfully',
    data: req.body
  });
});

// Isolated Error Test Endpoint
app.get(
  '/error-test',
  asyncHandler(async () => {
    throw new AppError('This is a test operational error', 400, 'BAD_REQUEST');
  })
);

// 404 Fallback for undefined routes
app.use('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

// Centralized Error Middleware (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`[Zero Delala Backend] Server running on http://localhost:${PORT}`);
});
