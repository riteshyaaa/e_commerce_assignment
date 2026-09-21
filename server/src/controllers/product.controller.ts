import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ApiResponse } from '../utils/apiResponse';
import { ProductStatus } from '@prisma/client';

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProducts(req.query as any);
      return ApiResponse.paginated(res, result.data, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlugOrId(req.params.id);
      return ApiResponse.success(res, product);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      return ApiResponse.created(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      return ApiResponse.success(res, product, 200, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return ApiResponse.success(res, { deleted: true }, 200, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.toggleFeatured(req.params.id);
      return ApiResponse.success(
        res,
        product,
        200,
        `Product marked as ${product.featured ? 'featured' : 'standard'}`
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const product = await ProductService.updateStatus(req.params.id, status as ProductStatus);
      return ApiResponse.success(res, product, 200, `Product status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }
}
