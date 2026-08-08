import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { checkMembershipSchema } from '../schemas/growth.schema.js';
import {
  checkChannelMembership,
  getChannelGateInfo,
  claimWelcomeBenefit
} from '../controllers/growth.controller.js';

const router = Router();

router.get('/channel-gate', getChannelGateInfo);
router.post('/check-membership', validateRequest(checkMembershipSchema), checkChannelMembership);
router.post('/welcome-benefit', requireAuth, claimWelcomeBenefit);

export default router;
