import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { checkMembershipSchema, attributeReferralSchema } from '../schemas/growth.schema.js';
import {
  checkChannelMembership,
  getChannelGateInfo,
  claimWelcomeBenefit,
  getReferralInfo,
  attributeReferral
} from '../controllers/growth.controller.js';

const router = Router();

router.get('/channel-gate', getChannelGateInfo);
router.post('/check-membership', validateRequest(checkMembershipSchema), checkChannelMembership);
router.post('/welcome-benefit', requireAuth, claimWelcomeBenefit);
router.get('/referral-info', requireAuth, getReferralInfo);
router.post(
  '/attribute-referral',
  requireAuth,
  validateRequest(attributeReferralSchema),
  attributeReferral
);

export default router;
