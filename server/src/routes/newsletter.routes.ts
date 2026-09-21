import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletter.controller';
import { validateBody } from '../middleware/validate.middleware';
import { subscribeNewsletterSchema } from '../validators/newsletter.validator';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public subscription endpoint
router.post('/subscribe', validateBody(subscribeNewsletterSchema), NewsletterController.subscribe);

// Admin read endpoint
router.get('/', authenticateAdmin as any, NewsletterController.getAll);

export default router;
