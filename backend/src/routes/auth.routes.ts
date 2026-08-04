import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { telegramLoginSchema } from '../schemas/auth.schema.js';
import { telegramLogin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/telegram-login', validateRequest(telegramLoginSchema), telegramLogin);

export default router;
