import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

// Protected admin routes
router.get('/stats', authenticateAdmin as any, DashboardController.getStats);
router.get('/analytics', authenticateAdmin as any, DashboardController.getAnalytics);

export default router;
