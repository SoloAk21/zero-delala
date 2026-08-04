import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      if (parsed && typeof parsed === 'object') {
        const parsedRecord = parsed as Record<string, any>;
        if (parsedRecord.body !== undefined) req.body = parsedRecord.body;
        if (parsedRecord.query !== undefined) req.query = parsedRecord.query;
        if (parsedRecord.params !== undefined) req.params = parsedRecord.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.').replace(/^(body|query|params)\./, ''),
          message: issue.message
        }));

        next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};
