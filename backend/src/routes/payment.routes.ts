import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { initializePaymentSchema } from '../schemas/payment.schema.js';
import { initializeListingFeePayment, verifyPayment } from '../controllers/payment.controller.js';

const router = Router();

router.post(
  '/initialize',
  requireAuth,
  validateRequest(initializePaymentSchema),
  initializeListingFeePayment
);
router.get('/verify/:txRef', requireAuth, verifyPayment);

export default router;
