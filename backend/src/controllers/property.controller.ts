import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { initializeChapaPayment } from '../services/chapa.service.js';
import { CreatePropertyInput, GetPropertiesQueryInput } from '../schemas/property.schema.js';

export const createProperty = asyncHandler(
  async (req: Request<{}, {}, CreatePropertyInput>, res: Response) => {
    const user = req.user!;
    const ownerId = user.id;
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

    const userRewardCredits = (user as any).rewardListingsCount || 0;
    const hasFreeCredit = userRewardCredits > 0;
    const propertyStatus = hasFreeCredit ? 'ACTIVE' : 'PENDING_VERIFICATION';

    // 1. Create property listing in database
    const property = await prisma.property.create({
      data: {
        title,
        titleAmharic: titleAmharic || null,
        description,
        listingType,
        category,
        status: propertyStatus,
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

    let checkoutUrl: string | undefined = undefined;
    let txRef: string | undefined = undefined;

    if (hasFreeCredit) {
      // Deduct 1 free listing reward credit
      await prisma.user.update({
        where: { id: ownerId },
        data: {
          rewardListingsCount: { decrement: 1 }
        } as any
      });
    } else {
      // Initialize Chapa payment session for listing fee (500 ETB)
      txRef = `zd_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const cleanUsername = user.username ? user.username.replace(/[^a-zA-Z0-9]/g, '') : 'customer';

      const chapaResponse = await initializeChapaPayment({
        amount: 500,
        currency: 'ETB',
        email: `${cleanUsername}@gmail.com`,
        firstName: user.firstName,
        lastName: user.lastName || 'User',
        phoneNumber: user.phoneNumber || '0911000000',
        txRef,
        callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/payments/webhook`,
        returnUrl: `${process.env.WEBAPP_URL || 'http://localhost:3000'}?payment=success`,
        customTitle: 'Zero Delala'
      });

      checkoutUrl = chapaResponse.data?.checkout_url || chapaResponse.checkout_url;
    }

    const response: ApiResponse<{
      property: typeof property;
      requiresPayment: boolean;
      checkoutUrl?: string;
      txRef?: string;
    }> = {
      success: true,
      data: {
        property,
        requiresPayment: !hasFreeCredit,
        checkoutUrl,
        txRef
      }
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

  // Only ACTIVE properties are shown on the public marketplace
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

export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const existingProperty = await prisma.property.findUnique({
    where: { id }
  });

  if (!existingProperty || existingProperty.status === 'DEACTIVATED') {
    throw new AppError('Property listing not found or inactive', 404, 'NOT_FOUND');
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: {
      viewsCount: { increment: 1 }
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

  const response: ApiResponse<typeof updatedProperty> = {
    success: true,
    data: updatedProperty
  };

  res.status(200).json(response);
});
