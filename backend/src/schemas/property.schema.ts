import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long'),
    titleAmharic: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    listingType: z.enum(['FOR_SALE', 'FOR_RENT', 'LOOKING_TO_BUY', 'LOOKING_TO_RENT']),
    category: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'LAND']),
    price: z.number().positive('Price must be a positive number'),
    isNegotiable: z.boolean().optional().default(true),
    areaSqm: z.number().positive('Area in SQM must be a positive number'),
    bedrooms: z.number().int().nonnegative().optional().default(0),
    bathrooms: z.number().int().nonnegative().optional().default(0),
    amenities: z.array(z.string()).optional().default([]),
    images: z.array(z.string()).optional().default([]),
    location: z.object({
      region: z.string().min(1, 'Region is required'),
      subcity: z.string().optional(),
      woreda: z.string().optional(),
      kebele: z.string().optional(),
      address: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional()
    })
  })
});

export const getPropertiesQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    region: z.string().optional(),
    subcity: z.string().optional(),
    category: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'LAND']).optional(),
    listingType: z.enum(['FOR_SALE', 'FOR_RENT', 'LOOKING_TO_BUY', 'LOOKING_TO_RENT']).optional(),
    minPrice: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    maxPrice: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    bedrooms: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    bathrooms: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
  })
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>['body'];
export type GetPropertiesQueryInput = z.infer<typeof getPropertiesQuerySchema>['query'];
