import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    titleAmharic: z.string().optional().nullable(),
    description: z.string().min(3, 'Description must be at least 3 characters long'),
    listingType: z.enum(['FOR_SALE', 'FOR_RENT', 'LOOKING_TO_BUY', 'LOOKING_TO_RENT']),
    category: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'LAND']),
    price: z
      .number()
      .or(z.string().regex(/^\d+$/).transform(Number))
      .refine((num) => num > 0, 'Price must be greater than 0'),
    isNegotiable: z.boolean().optional().default(true),
    areaSqm: z
      .number()
      .or(z.string().regex(/^\d+$/).transform(Number))
      .refine((num) => num > 0, 'Area in SQM must be greater than 0'),
    bedrooms: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional().default(0),
    bathrooms: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional().default(0),
    amenities: z.array(z.string()).optional().default([]),
    images: z.array(z.string()).optional().default([]),
    location: z.object({
      region: z.string().min(1, 'Region is required'),
      subcity: z.string().optional().nullable(),
      woreda: z.string().optional().nullable(),
      kebele: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable()
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

export const getPropertyByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid property ID format')
  })
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>['body'];
export type GetPropertiesQueryInput = z.infer<typeof getPropertiesQuerySchema>['query'];
export type GetPropertyByIdParamsInput = z.infer<typeof getPropertyByIdSchema>['params'];
