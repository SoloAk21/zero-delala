import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchChannelGateInfo, checkChannelMembershipApi } from '../services/growthService';
import { useTelegram } from '../providers/TelegramProvider';

export const useChannelGateInfoQuery = () => {
  return useQuery({
    queryKey: ['channelGateInfo'],
    queryFn: fetchChannelGateInfo
  });
};

export const useCheckMembershipQuery = () => {
  const { user } = useTelegram();

  return useQuery({
    queryKey: ['membershipStatus', user?.id],
    queryFn: () => checkChannelMembershipApi(user?.id)
  });
};

export const useVerifyMembershipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (telegramId?: string | number) => checkChannelMembershipApi(telegramId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipStatus'] });
    }
  });
};
