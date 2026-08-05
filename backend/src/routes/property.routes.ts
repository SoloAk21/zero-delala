import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createPropertySchema,
  getPropertiesQuerySchema,
  getPropertyByIdSchema
} from '../schemas/property.schema.js';
import {
  createProperty,
  getProperties,
  getPropertyById
} from '../controllers/property.controller.js';

const router = Router();

// Public Property Discovery APIs
router.get('/', validateRequest(getPropertiesQuerySchema), getProperties);
router.get('/:id', validateRequest(getPropertyByIdSchema), getPropertyById);

// Protected Property Creation API
router.post('/', requireAuth, validateRequest(createPropertySchema), createProperty);

export default router;
