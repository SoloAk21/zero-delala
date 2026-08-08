import { apiClient } from './api';
import { ApiResponse } from '@zero-delala/shared';

export interface ChannelGateInfo {
  channelUsername: string;
  channelTitle: string;
  joinUrl: string;
  isRequired: boolean;
}

export interface MembershipStatus {
  isMember: boolean;
  status: string;
  channelUsername: string;
  joinUrl: string;
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  rewardListingsCount: number;
  coupons: any[];
}

export const fetchChannelGateInfo = async () => {
  const response = await apiClient.get<ApiResponse<ChannelGateInfo>>('/growth/channel-gate');
  return response.data.data;
};

export const checkChannelMembershipApi = async (telegramId?: string | number) => {
  const response = await apiClient.post<ApiResponse<MembershipStatus>>('/growth/check-membership', {
    telegramId
  });
  return response.data.data;
};

export const fetchReferralInfoApi = async () => {
  const response = await apiClient.get<ApiResponse<ReferralInfo>>('/growth/referral-info');
  return response.data.data;
};

export const attributeReferralApi = async (referralCode: string) => {
  const response = await apiClient.post<ApiResponse<{ attributed: boolean }>>(
    '/growth/attribute-referral',
    {
      referralCode
    }
  );
  return response.data.data;
};
