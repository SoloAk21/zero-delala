import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ETHIOPIAN_REGIONS } from '@zero-delala/shared';
import { logger } from './utils/logger.js';
import { AppError } from './utils/AppError.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

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
