import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProperties,
  fetchPropertyById,
  createPropertyApi,
  GetPropertiesParams,
  CreatePropertyPayload
} from '../services/propertyService';

export const usePropertiesQuery = (params?: GetPropertiesParams) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => fetchProperties(params)
  });
};

export const usePropertyDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchPropertyById(id!),
    enabled: !!id
  });
};

export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createPropertyApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });
};
