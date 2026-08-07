import axios from 'axios';
import dotenv from 'dotenv';
import { AppError } from '../utils/AppError.js';

dotenv.config();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-placeholder';
const CHAPA_API_URL = 'https://api.chapa.co/v1';

export interface InitializeChapaPaymentParams {
  amount: number;
  currency?: string;
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName?: string;
  txRef: string;
  callbackUrl?: string;
  returnUrl?: string;
  customTitle?: string;
}

export const initializeChapaPayment = async (params: InitializeChapaPaymentParams) => {
  const isChapaConfigured =
    CHAPA_SECRET_KEY &&
    CHAPA_SECRET_KEY !== 'CHASECK_TEST-placeholder' &&
    CHAPA_SECRET_KEY !== 'CHASECK_TEST-placeholder_secret_key' &&
    !CHAPA_SECRET_KEY.includes('placeholder');

  if (!isChapaConfigured) {
    return {
      status: 'success',
      message: 'Mock payment initialized for local development',
      data: {
        checkout_url: `https://checkout.chapa.co/checkout/test-payment?tx_ref=${params.txRef}`
      }
    };
  }

  try {
    const formattedEmail =
      params.email && params.email.includes('@')
        ? params.email.replace(/[^a-zA-Z0-9@.]/g, '')
        : 'customer@gmail.com';

    const response = await axios.post(
      `${CHAPA_API_URL}/transaction/initialize`,
      {
        amount: params.amount.toString(),
        currency: params.currency || 'ETB',
        email: formattedEmail,
        phone_number: params.phoneNumber || '0911000000',
        first_name: params.firstName,
        last_name: params.lastName || 'User',
        tx_ref: params.txRef,
        callback_url: params.callbackUrl,
        return_url: params.returnUrl,
        customization: {
          title: (params.customTitle || 'Zero Delala').slice(0, 16),
          description: 'Ethiopian Real Estate Listing Fee'.slice(0, 50)
        }
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMsg =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : JSON.stringify(error.response?.data || error.message);
    throw new AppError(`Chapa payment initialization failed: ${errorMsg}`, 400, 'CHAPA_ERROR');
  }
};

export const verifyChapaTransaction = async (txRef: string) => {
  const isChapaConfigured =
    CHAPA_SECRET_KEY &&
    CHAPA_SECRET_KEY !== 'CHASECK_TEST-placeholder' &&
    CHAPA_SECRET_KEY !== 'CHASECK_TEST-placeholder_secret_key' &&
    !CHAPA_SECRET_KEY.includes('placeholder');

  if (!isChapaConfigured) {
    return {
      status: 'success',
      message: 'Mock payment verified successfully',
      data: {
        tx_ref: txRef,
        status: 'success',
        amount: 500,
        currency: 'ETB'
      }
    };
  }

  try {
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${txRef}`, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`
      }
    });
    return response.data;
  } catch (error: any) {
    const errorMsg =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : JSON.stringify(error.response?.data || error.message);
    throw new AppError(`Chapa verification failed: ${errorMsg}`, 400, 'CHAPA_VERIFY_ERROR');
  }
};
