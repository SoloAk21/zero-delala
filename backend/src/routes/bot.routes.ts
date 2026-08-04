import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { syncTelegramUserSchema } from '../schemas/bot.schema.js';
import { syncTelegramUser } from '../controllers/bot.controller.js';

const router = Router();

router.post('/sync-user', validateRequest(syncTelegramUserSchema), syncTelegramUser);

export default router;
