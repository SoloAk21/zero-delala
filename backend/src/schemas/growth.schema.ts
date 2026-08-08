import { z } from 'zod';

export const checkMembershipSchema = z.object({
  body: z.object({
    telegramId: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
    channelUsername: z.string().optional().default('@ZeroDelala')
  })
});

export const attributeReferralSchema = z.object({
  body: z.object({
    referralCode: z.string().min(1, 'Referral code is required')
  })
});

export type CheckMembershipInput = z.infer<typeof checkMembershipSchema>['body'];
export type AttributeReferralInput = z.infer<typeof attributeReferralSchema>['body'];
