import { Router, Request, Response } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { requireAuth } from '../middleware/auth.js';
import { telegramLoginSchema } from '../schemas/auth.schema.js';
import { telegramLogin } from '../controllers/auth.controller.js';
import { ApiResponse } from '@zero-delala/shared';

const router = Router();

router.post('/telegram-login', validateRequest(telegramLoginSchema), telegramLogin);

// Protected Endpoint: GET /api/v1/auth/me
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const serializedUser = {
    ...req.user!,
    telegramId: req.user!.telegramId.toString()
  };

  const response: ApiResponse<typeof serializedUser> = {
    success: true,
    data: serializedUser
  };

  res.status(200).json(response);
});

export default router;
