import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreatePropertyInput } from '../schemas/property.schema.js';

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

    // Create Property and nested Location in a single atomic database operation
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
