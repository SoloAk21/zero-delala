import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { verifyTelegramChannelMembership } from '../services/growth.service.js';
import {
  CheckMembershipInput,
  AttributeReferralInput,
  ApplyCouponInput
} from '../schemas/growth.schema.js';

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
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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

export const getReferralInfo = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const botUsername = 'zero_delala_bot';
  const referralCode = (user as any).referralCode || `ref_${user.telegramId}`;
  const referralLink = `https://t.me/${botUsername}/app?startapp=${referralCode}`;

  const userCoupons = await db.userCoupon.findMany({
    where: { userId: user.id },
    include: { coupon: true }
  });

  const response: ApiResponse<{
    referralCode: string;
    referralLink: string;
    referralCount: number;
    rewardListingsCount: number;
    coupons: any[];
  }> = {
    success: true,
    data: {
      referralCode,
      referralLink,
      referralCount: (user as any).referralCount || 0,
      rewardListingsCount: (user as any).rewardListingsCount || 0,
      coupons: userCoupons
    }
  };

  res.status(200).json(response);
});

export const attributeReferral = asyncHandler(
  async (req: Request<{}, {}, AttributeReferralInput>, res: Response) => {
    const refereeId = req.user!.id;
    const { referralCode } = req.body;

    if ((req.user as any).referralCode === referralCode) {
      res.status(200).json({
        success: true,
        message: 'Self-referral ignored',
        data: { attributed: false }
      });
      return;
    }

    const referrer = await prisma.user.findFirst({
      where: { referralCode }
    });

    if (!referrer) {
      res.status(200).json({
        success: true,
        message: 'Referral code not found',
        data: { attributed: false }
      });
      return;
    }

    const existingReferral = await db.referral.findUnique({
      where: { refereeId }
    });

    if (existingReferral) {
      res.status(200).json({
        success: true,
        message: 'User already referred',
        data: { attributed: false }
      });
      return;
    }

    const promo70 = await db.coupon.upsert({
      where: { code: 'PROMO70' },
      update: {},
      create: {
        code: 'PROMO70',
        description: '70% OFF Listing Promotion Referral Reward',
        discountPercent: 70,
        isReferralCoupon: true,
        maxRedemptions: 100000
      }
    });

    await db.$transaction([
      db.referral.create({
        data: {
          referrerId: referrer.id,
          refereeId,
          referralCode,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      }),
      prisma.user.update({
        where: { id: refereeId },
        data: { referredById: referrer.id } as any
      }),
      prisma.user.update({
        where: { id: referrer.id },
        data: {
          referralCount: { increment: 1 },
          rewardListingsCount: { increment: 1 }
        } as any
      }),
      db.userCoupon.create({
        data: {
          userId: referrer.id,
          couponId: promo70.id,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        }
      }),
      db.rewardLog.create({
        data: {
          userId: referrer.id,
          action: 'REFERRAL_REWARD_AWARDED',
          rewardType: 'REFERRAL_BONUS',
          amount: 1,
          description: `Earned 1 Free Listing + 70% Discount Coupon for inviting ${req.user!.firstName}`
        }
      })
    ]);

    const response: ApiResponse<{ attributed: boolean }> = {
      success: true,
      data: { attributed: true }
    };

    res.status(200).json(response);
  }
);

export const getUserCoupons = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const userCoupons = await db.userCoupon.findMany({
    where: {
      userId,
      isUsed: false
    },
    include: {
      coupon: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const response: ApiResponse<typeof userCoupons> = {
    success: true,
    data: userCoupons
  };

  res.status(200).json(response);
});

export const applyCoupon = asyncHandler(
  async (req: Request<{}, {}, ApplyCouponInput>, res: Response) => {
    const userId = req.user!.id;
    const { code, amount = 500 } = req.body;

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isActive) {
      throw new AppError('Invalid or inactive coupon code', 400, 'INVALID_COUPON');
    }

    const userCoupon = await db.userCoupon.findFirst({
      where: {
        userId,
        couponId: coupon.id,
        isUsed: false
      }
    });

    if (!userCoupon) {
      throw new AppError(
        'Coupon not found in your wallet or already used',
        400,
        'COUPON_NOT_IN_WALLET'
      );
    }

    if (userCoupon.expiresAt && new Date(userCoupon.expiresAt) < new Date()) {
      throw new AppError('Coupon has expired', 400, 'COUPON_EXPIRED');
    }

    const discountAmount = Math.round((amount * coupon.discountPercent) / 100);
    const finalAmount = Math.max(0, amount - discountAmount);

    const response: ApiResponse<{
      code: string;
      discountPercent: number;
      originalAmount: number;
      discountAmount: number;
      finalAmount: number;
      userCouponId: string;
    }> = {
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        originalAmount: amount,
        discountAmount,
        finalAmount,
        userCouponId: userCoupon.id
      }
    };

    res.status(200).json(response);
  }
);

export const getGrowthAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, totalProperties, totalReferrals, totalRewardLogs, totalCoupons] =
    await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      db.referral.count({ where: { status: 'COMPLETED' } }),
      db.rewardLog.count(),
      db.userCoupon.count()
    ]);

  const response: ApiResponse<{
    totalUsers: number;
    totalProperties: number;
    totalReferrals: number;
    totalRewardLogs: number;
    totalCouponsIssued: number;
  }> = {
    success: true,
    data: {
      totalUsers,
      totalProperties,
      totalReferrals,
      totalRewardLogs,
      totalCouponsIssued: totalCoupons
    }
  };

  res.status(200).json(response);
});
