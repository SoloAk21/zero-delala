import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller.js';

const router = Router();

router.post('/toggle', requireAuth, toggleFavorite);
router.get('/', requireAuth, getFavorites);

export default router;
