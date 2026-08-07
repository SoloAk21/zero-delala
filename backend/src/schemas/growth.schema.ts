import { z } from 'zod';

export const checkMembershipSchema = z.object({
  body: z.object({
    telegramId: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
    channelUsername: z.string().optional().default('@ZeroDelala')
  })
});

export type CheckMembershipInput = z.infer<typeof checkMembershipSchema>['body'];
