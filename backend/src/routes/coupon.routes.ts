import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { applyCouponSchema } from '../schemas/growth.schema.js';
import { getUserCoupons, applyCoupon } from '../controllers/growth.controller.js';

const router = Router();

router.get('/', requireAuth, getUserCoupons);
router.post('/apply', requireAuth, validateRequest(applyCouponSchema), applyCoupon);

export default router;
