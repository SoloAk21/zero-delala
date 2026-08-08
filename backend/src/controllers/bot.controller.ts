import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SyncTelegramUserInput } from '../schemas/bot.schema.js';

export const syncTelegramUser = asyncHandler(
  async (req: Request<{}, {}, SyncTelegramUserInput>, res: Response) => {
    const { telegramId, firstName, lastName, username, phoneNumber } = req.body;

    // Check if new user
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) }
    });

    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(telegramId)
      },
      update: {
        firstName,
        lastName: lastName || null,
        username: username || null,
        ...(phoneNumber ? { phoneNumber } : {})
      },
      create: {
        telegramId: BigInt(telegramId),
        firstName,
        lastName: lastName || null,
        username: username || null,
        phoneNumber: phoneNumber || null,
        role: 'OWNER',
        rewardListingsCount: 1, // Award 1 First Free Listing Credit
        referralCode: `ref_${telegramId}_${Math.floor(Math.random() * 1000)}`
      }
    });

    const serializedUser = {
      ...user,
      telegramId: user.telegramId.toString()
    };

    const response: ApiResponse<typeof serializedUser> = {
      success: true,
      data: serializedUser
    };

    res.status(200).json(response);
  }
);
