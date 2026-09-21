import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
} from '../validators/product.validator';
import { productQuerySchema } from '../validators/query.validator';

const router = Router();

// Public routes
router.get('/', validateQuery(productQuerySchema), ProductController.getAll);
router.get('/:id', validateParams(productIdParamSchema), ProductController.getOne);

// Protected admin routes
router.post(
  '/',
  authenticateAdmin as any,
  validateBody(createProductSchema),
  ProductController.create
);

router.patch(
  '/:id',
  authenticateAdmin as any,
  validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  ProductController.update
);

router.delete(
  '/:id',
  authenticateAdmin as any,
  validateParams(productIdParamSchema),
  ProductController.delete
);

router.patch(
  '/:id/toggle-featured',
  authenticateAdmin as any,
  validateParams(productIdParamSchema),
  ProductController.toggleFeatured
);

router.patch(
  '/:id/status',
  authenticateAdmin as any,
  validateParams(productIdParamSchema),
  ProductController.updateStatus
);

export default router;
