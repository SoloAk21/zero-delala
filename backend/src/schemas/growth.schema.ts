import { z } from 'zod';

export const checkMembershipSchema = z.object({
  body: z.object({
    telegramId: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
    channelUsername: z.string().optional().default('@zero_delala_channel')
  })
});

export type CheckMembershipInput = z.infer<typeof checkMembershipSchema>['body'];
