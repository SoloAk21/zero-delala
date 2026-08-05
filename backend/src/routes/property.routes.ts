import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createPropertySchema } from '../schemas/property.schema.js';
import { createProperty } from '../controllers/property.controller.js';

const router = Router();

router.post('/', requireAuth, validateRequest(createPropertySchema), createProperty);

export default router;
