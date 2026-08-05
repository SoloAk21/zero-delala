import { apiClient } from './api';
import { ApiResponse } from '@zero-delala/shared';

export interface PropertyLocation {
  id?: string;
  region: string;
  subcity?: string | null;
  woreda?: string | null;
  kebele?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PropertyOwner {
  id: string;
  firstName: string;
  lastName?: string | null;
  phoneNumber?: string | null;
  isVerifiedAgent: boolean;
}

export interface Property {
  id: string;
  title: string;
  titleAmharic?: string | null;
  description: string;
  listingType: 'FOR_SALE' | 'FOR_RENT' | 'LOOKING_TO_BUY' | 'LOOKING_TO_RENT';
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND';
  status: string;
  price: number;
  isNegotiable: boolean;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  viewsCount: number;
  location?: PropertyLocation | null;
  owner?: PropertyOwner | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetPropertiesParams {
  category?: string;
  listingType?: string;
  region?: string;
  subcity?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CreatePropertyPayload {
  title: string;
  titleAmharic?: string;
  description: string;
  listingType: 'FOR_SALE' | 'FOR_RENT';
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND';
  price: number;
  isNegotiable?: boolean;
  areaSqm: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  location: {
    region: string;
    subcity?: string;
    woreda?: string;
    kebele?: string;
    address?: string;
  };
}

export const fetchProperties = async (params?: GetPropertiesParams) => {
  const response = await apiClient.get<ApiResponse<{ properties: Property[]; pagination: any }>>(
    '/properties',
    {
      params
    }
  );
  return response.data.data;
};

export const fetchPropertyById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
  return response.data.data;
};

export const createPropertyApi = async (payload: CreatePropertyPayload) => {
  const response = await apiClient.post<ApiResponse<Property>>('/properties', payload);
  return response.data.data;
};
