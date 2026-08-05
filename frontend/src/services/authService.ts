import { apiClient } from './api';
import { ApiResponse } from '@zero-delala/shared';
import { UserProfile } from '../store/useAuthStore';

export const telegramLoginApi = async (initData: string) => {
  const response = await apiClient.post<ApiResponse<{ token: string; user: UserProfile }>>(
    '/auth/telegram-login',
    { initData }
  );
  return response.data.data;
};
