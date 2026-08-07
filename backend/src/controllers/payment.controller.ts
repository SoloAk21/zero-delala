import { Request, Response } from 'express';
import { ApiResponse } from '@zero-delala/shared';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { initializeChapaPayment, verifyChapaTransaction } from '../services/chapa.service.js';
import { InitializePaymentInput } from '../schemas/payment.schema.js';

export const initializeListingFeePayment = asyncHandler(
  async (req: Request<{}, {}, InitializePaymentInput>, res: Response) => {
    const { propertyId, amount = 500, phoneNumber } = req.body;

    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      throw new AppError('Property listing not found for payment initialization', 404, 'NOT_FOUND');
    }

    const txRef = `zd_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const cleanUsername = req.user!.username
      ? req.user!.username.replace(/[^a-zA-Z0-9]/g, '')
      : 'customer';
    const cleanEmail = `${cleanUsername}@gmail.com`;

    const chapaResponse = await initializeChapaPayment({
      amount,
      currency: 'ETB',
      email: cleanEmail,
      firstName: req.user!.firstName,
      lastName: req.user!.lastName || 'User',
      phoneNumber: phoneNumber || req.user!.phoneNumber || '0911000000',
      txRef,
      callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/payments/webhook`,
      returnUrl: `${process.env.WEBAPP_URL || 'http://localhost:3000'}?payment=success`,
      customTitle: 'Zero Delala'
    });

    const response: ApiResponse<{ checkoutUrl: string; txRef: string }> = {
      success: true,
      data: {
        checkoutUrl:
          chapaResponse.data?.checkout_url ||
          chapaResponse.checkout_url ||
          'https://checkout.chapa.co',
        txRef
      }
    };

    res.status(200).json(response);
  }
);

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const txRef = req.params.txRef as string;

  if (!txRef) {
    throw new AppError('Transaction reference is required', 400, 'BAD_REQUEST');
  }

  const verification = await verifyChapaTransaction(txRef);

  const response: ApiResponse<typeof verification> = {
    success: true,
    data: verification
  };

  res.status(200).json(response);
});
