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

export const applyCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    amount: z.number().positive().default(500)
  })
});

export type CheckMembershipInput = z.infer<typeof checkMembershipSchema>['body'];
export type AttributeReferralInput = z.infer<typeof attributeReferralSchema>['body'];
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>['body'];
