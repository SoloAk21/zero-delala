import { apiClient } from './api';
import { ApiResponse } from '@zero-delala/shared';
import { Property } from './propertyService';

export const fetchFavorites = async () => {
  const response = await apiClient.get<ApiResponse<Property[]>>('/favorites');
  return response.data.data || [];
};

export const toggleFavoriteApi = async (propertyId: string) => {
  const response = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>('/favorites/toggle', {
    propertyId
  });
  return response.data.data;
};
