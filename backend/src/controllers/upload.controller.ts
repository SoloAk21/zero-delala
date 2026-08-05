import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiResponse } from '@zero-delala/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured =
  CLOUDINARY_CLOUD_NAME &&
  CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  CLOUDINARY_API_KEY &&
  CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });
}

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError('No image files provided for upload', 400, 'NO_FILES_PROVIDED');
  }

  const urls: string[] = [];

  if (isCloudinaryConfigured) {
    for (const file of files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'zero-delala/properties'
      });
      urls.push(uploadResult.secure_url);
      fs.unlinkSync(file.path);
    }
  } else {
    const host = `${req.protocol}://${req.get('host')}`;
    for (const file of files) {
      urls.push(`${host}/uploads/${file.filename}`);
    }
  }

  const response: ApiResponse<{ urls: string[] }> = {
    success: true,
    data: { urls }
  };

  res.status(200).json(response);
});
