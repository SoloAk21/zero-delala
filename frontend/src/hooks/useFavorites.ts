import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFavorites, toggleFavoriteApi } from '../services/favoriteService';
import { useAuthStore } from '../store/useAuthStore';

export const useFavoritesQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    enabled: isAuthenticated
  });
};

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => toggleFavoriteApi(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });
};
