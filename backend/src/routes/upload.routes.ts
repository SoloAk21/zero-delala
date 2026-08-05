import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { uploadImages } from '../controllers/upload.controller.js';

const router = Router();

router.post('/images', requireAuth, uploadMiddleware.array('images', 5), uploadImages);

export default router;
