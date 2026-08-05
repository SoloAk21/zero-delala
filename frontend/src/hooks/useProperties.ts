import { useQuery } from '@tanstack/react-query';
import {
  fetchProperties,
  fetchPropertyById,
  GetPropertiesParams
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
