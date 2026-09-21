import { Request, Response, NextFunction } from 'express';
import { NewsletterService } from '../services/newsletter.service';
import { ApiResponse } from '../utils/apiResponse';

export class NewsletterController {
  static async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await NewsletterService.subscribe(email);
      return ApiResponse.success(res, result, 200, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const subscribers = await NewsletterService.getSubscribers();
      return ApiResponse.success(res, subscribers);
    } catch (error) {
      next(error);
    }
  }
}
