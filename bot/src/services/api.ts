import axios from 'axios';
import 'dotenv/config';
import { ApiResponse } from '@zero-delala/shared';

const BACKEND_URL = process.env.BACKEND_URL || 'https://zero-delala-backend1.onrender.com';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface TelegramUserData {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
}

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 3000 });
    return response.status === 200 || response.status === 503;
  } catch (error) {
    return false;
  }
};

export const syncUserWithBackend = async (
  userData: TelegramUserData
): Promise<ApiResponse<any> | null> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/bot/sync-user', userData);
    return response.data;
  } catch (error) {
    console.error('[Zero Delala Bot] Backend sync failed:', (error as Error).message);
    return null;
  }
};
