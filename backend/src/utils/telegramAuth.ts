import crypto from 'crypto';
import { AppError } from './AppError.js';

export interface ParsedTelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}

export interface VerifiedInitData {
  user: ParsedTelegramUser;
  auth_date: number;
  query_id?: string;
}

export function verifyTelegramInitData(initData: string, botToken: string): VerifiedInitData {
  if (!initData) {
    throw new AppError('Telegram initData is missing', 401, 'MISSING_INIT_DATA');
  }

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');

  if (!hash) {
    throw new AppError('Hash parameter missing from initData', 401, 'INVALID_AUTH_HASH');
  }

  // Remove hash parameter before building data-check string
  urlParams.delete('hash');

  // Sort remaining parameters alphabetically into key=value lines
  const params: string[] = [];
  urlParams.forEach((value, key) => {
    params.push(`${key}=${value}`);
  });
  params.sort();
  const dataCheckString = params.join('\n');

  // Compute secret key = HMAC-SHA256("WebAppData", botToken)
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

  // Compute calculated hash = HMAC-SHA256(secretKey, dataCheckString)
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Timing-safe comparison to prevent timing attacks
  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');
  const providedBuffer = Buffer.from(hash, 'hex');

  if (
    calculatedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(calculatedBuffer, providedBuffer)
  ) {
    throw new AppError(
      'Telegram authentication signature mismatch',
      401,
      'INVALID_TELEGRAM_SIGNATURE'
    );
  }

  // Verify auth_date freshness (must be less than 24 hours old)
  const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
  const currentTime = Math.floor(Date.now() / 1000);
  const MAX_AUTH_AGE = 86400; // 24 hours in seconds

  if (currentTime - authDate > MAX_AUTH_AGE) {
    throw new AppError('Telegram authentication session expired', 401, 'AUTH_SESSION_EXPIRED');
  }

  // Parse user payload
  const userJson = urlParams.get('user');
  if (!userJson) {
    throw new AppError('Telegram user data missing from initData', 401, 'MISSING_TELEGRAM_USER');
  }

  try {
    const user: ParsedTelegramUser = JSON.parse(userJson);
    return {
      user,
      auth_date: authDate,
      query_id: urlParams.get('query_id') || undefined
    };
  } catch (error) {
    throw new AppError('Failed to parse Telegram user payload', 400, 'MALFORMED_TELEGRAM_USER');
  }
}
