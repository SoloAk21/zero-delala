import { z } from 'zod';

export const syncTelegramUserSchema = z.object({
  body: z.object({
    telegramId: z
      .number({ message: 'Telegram ID is required' })
      .or(z.string().regex(/^\d+$/).transform(Number)),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
    username: z.string().optional(),
    phoneNumber: z.string().optional()
  })
});

export type SyncTelegramUserInput = z.infer<typeof syncTelegramUserSchema>['body'];
