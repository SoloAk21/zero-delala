import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { checkMembershipSchema } from '../schemas/growth.schema.js';
import { checkChannelMembership, getChannelGateInfo } from '../controllers/growth.controller.js';

const router = Router();

router.get('/channel-gate', getChannelGateInfo);
router.post('/check-membership', validateRequest(checkMembershipSchema), checkChannelMembership);

export default router;
