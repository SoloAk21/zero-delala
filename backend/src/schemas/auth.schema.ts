import { z } from 'zod';

export const telegramLoginSchema = z.object({
  body: z.object({
    initData: z.string().min(1, 'Telegram initData is required')
  })
});

export const verifyPhoneSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string()
      .regex(
        /^(?:\+251|0)[79]\d{8}$/,
        'Must be a valid Ethiopian phone number (+2519... or 09...)'
      ),
    isAgent: z.boolean().optional().default(false)
  })
});

export type TelegramLoginInput = z.infer<typeof telegramLoginSchema>['body'];
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>['body'];
