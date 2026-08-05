import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createPropertySchema, getPropertiesQuerySchema } from '../schemas/property.schema.js';
import { createProperty, getProperties } from '../controllers/property.controller.js';

const router = Router();

// Public Property Discovery API
router.get('/', validateRequest(getPropertiesQuerySchema), getProperties);

// Protected Property Creation API
router.post('/', requireAuth, validateRequest(createPropertySchema), createProperty);

export default router;
