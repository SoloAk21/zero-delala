import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreatePropertyInput, GetPropertiesQueryInput } from '../schemas/property.schema.js';

export const createProperty = asyncHandler(
  async (req: Request<{}, {}, CreatePropertyInput>, res: Response) => {
    const ownerId = req.user!.id;
    const {
      title,
      titleAmharic,
      description,
      listingType,
      category,
      price,
      isNegotiable,
      areaSqm,
      bedrooms,
      bathrooms,
      amenities,
      images,
      location
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        titleAmharic: titleAmharic || null,
        description,
        listingType,
        category,
        price,
        isNegotiable,
        areaSqm,
        bedrooms,
        bathrooms,
        amenities,
        images,
        ownerId,
        location: {
          create: {
            region: location.region,
            subcity: location.subcity || null,
            woreda: location.woreda || null,
            kebele: location.kebele || null,
            address: location.address || null,
            latitude: location.latitude || null,
            longitude: location.longitude || null
          }
        }
      },
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            isVerifiedAgent: true
          }
        }
      }
    });

    const response: ApiResponse<typeof property> = {
      success: true,
      data: property
    };

    res.status(201).json(response);
  }
);

export const getProperties = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as GetPropertiesQueryInput;
  const {
    search,
    region,
    subcity,
    category,
    listingType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    page = 1,
    limit = 10
  } = query;

  const skip = (page - 1) * limit;

  const where: any = {
    status: 'ACTIVE'
  };

  if (category) where.category = category;
  if (listingType) where.listingType = listingType;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  if (bedrooms) where.bedrooms = { gte: bedrooms };
  if (bathrooms) where.bathrooms = { gte: bathrooms };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { titleAmharic: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (region || subcity) {
    where.location = {};
    if (region) where.location.region = { equals: region, mode: 'insensitive' };
    if (subcity) where.location.subcity = { equals: subcity, mode: 'insensitive' };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            isVerifiedAgent: true
          }
        }
      }
    }),
    prisma.property.count({ where })
  ]);

  const response: ApiResponse<{
    properties: typeof properties;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> = {
    success: true,
    data: {
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  };

  res.status(200).json(response);
});
