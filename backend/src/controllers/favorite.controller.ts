import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const toggleFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { propertyId } = req.body;

  if (!propertyId) {
    throw new AppError('Property ID is required', 400, 'BAD_REQUEST');
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: { userId, propertyId }
    }
  });

  let isFavorite = false;

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id }
    });
    isFavorite = false;
  } else {
    await prisma.favorite.create({
      data: { userId, propertyId }
    });
    isFavorite = true;
  }

  const response: ApiResponse<{ isFavorite: boolean }> = {
    success: true,
    data: { isFavorite }
  };

  res.status(200).json(response);
});

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
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
      }
    }
  });

  const properties = favorites.map((item: { property: any }) => item.property);

  const response: ApiResponse<typeof properties> = {
    success: true,
    data: properties
  };

  res.status(200).json(response);
});
