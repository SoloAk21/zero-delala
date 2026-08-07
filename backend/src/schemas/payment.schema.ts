import { z } from 'zod';

export const initializePaymentSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID format'),
    amount: z.number().positive('Amount must be a positive number').optional().default(500),
    phoneNumber: z.string().optional()
  })
});

export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>['body'];
