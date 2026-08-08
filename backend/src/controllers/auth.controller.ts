import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { verifyTelegramInitData } from '../utils/telegramAuth.js';
import { generateToken } from '../utils/jwt.js';
import { TelegramLoginInput, VerifyPhoneInput } from '../schemas/auth.schema.js';

export const telegramLogin = asyncHandler(
  async (req: Request<{}, {}, TelegramLoginInput>, res: Response) => {
    const { initData } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN || 'your_telegram_bot_token_here';

    let verifiedUser;

    if (botToken === 'your_telegram_bot_token_here') {
      const urlParams = new URLSearchParams(initData);
      const userJson = urlParams.get('user');
      if (!userJson) {
        throw new AppError(
          'Telegram user data missing from initData',
          400,
          'MISSING_TELEGRAM_USER'
        );
      }
      try {
        verifiedUser = { user: JSON.parse(userJson) };
      } catch (e) {
        throw new AppError('Malformed Telegram user JSON', 400, 'MALFORMED_TELEGRAM_USER');
      }
    } else {
      verifiedUser = verifyTelegramInitData(initData, botToken);
    }

    const tgUser = verifiedUser.user;

    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(tgUser.id)
      },
      update: {
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || null,
        username: tgUser.username || null
      },
      create: {
        telegramId: BigInt(tgUser.id),
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || null,
        username: tgUser.username || null,
        role: 'BUYER',
        referralCode: `ref_${tgUser.id}_${Math.floor(Math.random() * 1000)}`
      }
    });

    const token = generateToken({
      userId: user.id,
      telegramId: user.telegramId.toString(),
      role: user.role
    });

    const serializedUser = {
      ...user,
      telegramId: user.telegramId.toString()
    };

    const response: ApiResponse<{ token: string; user: typeof serializedUser }> = {
      success: true,
      data: {
        token,
        user: serializedUser
      }
    };

    res.status(200).json(response);
  }
);

export const verifyPhone = asyncHandler(
  async (req: Request<{}, {}, VerifyPhoneInput>, res: Response) => {
    const { phoneNumber, isAgent } = req.body;
    const userId = req.user!.id;

    const role = isAgent ? 'AGENT' : req.user!.role === 'BUYER' ? 'OWNER' : req.user!.role;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber,
        isVerifiedAgent: isAgent ? true : req.user!.isVerifiedAgent,
        role
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
