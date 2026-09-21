import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from '../validators/category.validator';

const router = Router();

// Public routes
router.get('/', CategoryController.getAll);
router.get('/:id', validateParams(categoryIdParamSchema), CategoryController.getOne);

// Protected admin routes
router.post(
  '/',
  authenticateAdmin as any,
  validateBody(createCategorySchema),
  CategoryController.create
);

router.patch(
  '/:id',
  authenticateAdmin as any,
  validateParams(categoryIdParamSchema),
  validateBody(updateCategorySchema),
  CategoryController.update
);

router.delete(
  '/:id',
  authenticateAdmin as any,
  validateParams(categoryIdParamSchema),
  CategoryController.delete
);

export default router;
