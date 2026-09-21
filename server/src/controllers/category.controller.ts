import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../utils/apiResponse';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeCount = req.query.includeCount !== 'false';
      const categories = await CategoryService.getAllCategories(includeCount);
      return ApiResponse.success(res, categories);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getCategoryBySlugOrId(req.params.id);
      return ApiResponse.success(res, category);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return ApiResponse.created(res, category, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      return ApiResponse.success(res, category, 200, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      return ApiResponse.success(res, { deleted: true }, 200, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
