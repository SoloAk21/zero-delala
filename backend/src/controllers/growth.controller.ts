import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyTelegramChannelMembership } from '../services/growth.service.js';
import { CheckMembershipInput } from '../schemas/growth.schema.js';

const db = prisma as any;

export const checkChannelMembership = asyncHandler(
  async (req: Request<{}, {}, CheckMembershipInput>, res: Response) => {
    const telegramId = req.body.telegramId || req.user?.telegramId?.toString();
    const channelUsername = req.body.channelUsername || '@ZeroDelala';

    if (!telegramId) {
      res.status(200).json({
        success: true,
        data: {
          isMember: false,
          status: 'unauthenticated',
          channelUsername,
          joinUrl: `https://t.me/${channelUsername.replace('@', '')}`
        }
      });
      return;
    }

    const membership = await verifyTelegramChannelMembership(telegramId, channelUsername);

    const response: ApiResponse<typeof membership> = {
      success: true,
      data: membership
    };

    res.status(200).json(response);
  }
);

export const getChannelGateInfo = asyncHandler(async (_req: Request, res: Response) => {
  const channelUsername = '@ZeroDelala';
  const response: ApiResponse<{
    channelUsername: string;
    channelTitle: string;
    joinUrl: string;
    isRequired: boolean;
  }> = {
    success: true,
    data: {
      channelUsername,
      channelTitle: 'Zero Delala Official Channel',
      joinUrl: `https://t.me/${channelUsername.replace('@', '')}`,
      isRequired: true
    }
  };

  res.status(200).json(response);
});

export const claimWelcomeBenefit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Check if welcome benefit was already claimed
  const existingLog = await db.rewardLog.findFirst({
    where: {
      userId,
      action: 'WELCOME_BENEFIT_CLAIMED'
    }
  });

  if (existingLog) {
    res.status(200).json({
      success: true,
      message: 'Welcome benefit already claimed',
      data: {
        alreadyClaimed: true,
        rewardListingsCount: (req.user as any).rewardListingsCount || 0
      }
    });
    return;
  }

  // Ensure Welcome Coupon WELCOME30 exists
  const welcomeCoupon = await db.coupon.upsert({
    where: { code: 'WELCOME30' },
    update: {},
    create: {
      code: 'WELCOME30',
      description: '30% OFF Welcome Discount on Property Promotion',
      discountPercent: 30,
      isWelcomeCoupon: true,
      maxRedemptions: 100000
    }
  });

  // Execute Welcome Benefit atomic updates
  const [updatedUser] = await db.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        rewardListingsCount: { increment: 1 }
      }
    }),
    db.userCoupon.create({
      data: {
        userId,
        couponId: welcomeCoupon.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
      }
    }),
    db.rewardLog.create({
      data: {
        userId,
        action: 'WELCOME_BENEFIT_CLAIMED',
        rewardType: 'FREE_LISTING',
        amount: 1,
        description: 'Awarded 1 First Free Listing + 30% Welcome Promotion Coupon WELCOME30'
      }
    })
  ]);

  const response: ApiResponse<{
    alreadyClaimed: boolean;
    rewardListingsCount: number;
    welcomeCoupon: {
      code: string;
      discountPercent: number;
    };
  }> = {
    success: true,
    data: {
      alreadyClaimed: false,
      rewardListingsCount: (updatedUser as any).rewardListingsCount || 1,
      welcomeCoupon: {
        code: welcomeCoupon.code,
        discountPercent: welcomeCoupon.discountPercent
      }
    }
  };

  res.status(200).json(response);
});
