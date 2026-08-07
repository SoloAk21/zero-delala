import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'your_telegram_bot_token_here';

export interface TelegramChatMemberStatus {
  isMember: boolean;
  status: string;
  channelUsername: string;
  joinUrl: string;
}

export const verifyTelegramChannelMembership = async (
  telegramId: string | number,
  channelUsername: string = '@zero_delala_channel'
): Promise<TelegramChatMemberStatus> => {
  const formattedUsername = channelUsername.startsWith('@')
    ? channelUsername
    : `@${channelUsername}`;
  const joinUrl = `https://t.me/${formattedUsername.replace('@', '')}`;

  // Local dry-run verification mode when live BOT_TOKEN is placeholder
  if (!BOT_TOKEN || BOT_TOKEN === 'your_telegram_bot_token_here') {
    logger.info(`[Growth Service] Dry-run membership check passed for Telegram ID: ${telegramId}`);
    return {
      isMember: true,
      status: 'member',
      channelUsername: formattedUsername,
      joinUrl
    };
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${formattedUsername}&user_id=${telegramId}`;
    const response = await axios.get(url, { timeout: 5000 });

    if (response.data && response.data.ok) {
      const memberStatus = response.data.result?.status;
      const activeStatuses = ['creator', 'administrator', 'member', 'restricted'];
      const isMember = activeStatuses.includes(memberStatus);

      return {
        isMember,
        status: memberStatus,
        channelUsername: formattedUsername,
        joinUrl
      };
    }

    return {
      isMember: false,
      status: 'left',
      channelUsername: formattedUsername,
      joinUrl
    };
  } catch (error: any) {
    logger.warn(`[Growth Service] Telegram getChatMember failed: ${error.message}`);
    return {
      isMember: false,
      status: 'left',
      channelUsername: formattedUsername,
      joinUrl
    };
  }
};
