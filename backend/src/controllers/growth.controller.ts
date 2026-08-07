import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyTelegramChannelMembership } from '../services/growth.service.js';
import { CheckMembershipInput } from '../schemas/growth.schema.js';

export const checkChannelMembership = asyncHandler(
  async (req: Request<{}, {}, CheckMembershipInput>, res: Response) => {
    const telegramId = req.body.telegramId || req.user?.telegramId?.toString();
    const channelUsername = req.body.channelUsername || '@zero_delala_channel';

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
  const channelUsername = '@zero_delala_channel';
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
