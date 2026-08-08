import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchChannelGateInfo,
  checkChannelMembershipApi,
  fetchReferralInfoApi,
  attributeReferralApi
} from '../services/growthService';
import { useTelegram } from '../providers/TelegramProvider';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../services/api';

export const useChannelGateInfoQuery = () => {
  return useQuery({
    queryKey: ['channelGateInfo'],
    queryFn: fetchChannelGateInfo
  });
};

export const useCheckMembershipQuery = () => {
  const { user } = useTelegram();
  const authUser = useAuthStore((state) => state.user);
  const activeTelegramId = user?.id || authUser?.telegramId || '8580032836';

  return useQuery({
    queryKey: ['membershipStatus', activeTelegramId],
    queryFn: () => checkChannelMembershipApi(activeTelegramId)
  });
};

export const useVerifyMembershipMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useTelegram();
  const authUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (telegramId?: string | number) => {
      const activeTelegramId = telegramId || user?.id || authUser?.telegramId || '8580032836';
      return checkChannelMembershipApi(activeTelegramId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipStatus'] });
    }
  });
};

export const useClaimWelcomeBenefitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/growth/welcome-benefit');
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralInfo'] });
    }
  });
};

export const useReferralInfoQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['referralInfo'],
    queryFn: fetchReferralInfoApi,
    enabled: isAuthenticated
  });
};

export const useAttributeReferralMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referralCode: string) => attributeReferralApi(referralCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralInfo'] });
    }
  });
};
