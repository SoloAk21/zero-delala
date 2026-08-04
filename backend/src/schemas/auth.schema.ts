import { z } from 'zod';

export const telegramLoginSchema = z.object({
  body: z.object({
    initData: z.string().min(1, 'Telegram initData is required')
  })
});

export type TelegramLoginInput = z.infer<typeof telegramLoginSchema>['body'];
