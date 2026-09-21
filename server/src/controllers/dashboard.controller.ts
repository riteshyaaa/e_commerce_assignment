import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/apiResponse';

export class DashboardController {
  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getStats();
      return ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await DashboardService.getAnalytics();
      return ApiResponse.success(res, analytics);
    } catch (error) {
      next(error);
    }
  }
}
