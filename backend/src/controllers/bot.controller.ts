import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SyncTelegramUserInput } from '../schemas/bot.schema.js';

export const syncTelegramUser = asyncHandler(
  async (req: Request<{}, {}, SyncTelegramUserInput>, res: Response) => {
    const { telegramId, firstName, lastName, username, phoneNumber } = req.body;

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
        phoneNumber: phoneNumber || null
      }
    });

    // Convert BigInt telegramId to String for JSON response
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
