import { Response } from 'express';
import { PaginationMeta } from '../types';

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200, message?: string) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    statusCode = 200,
    message?: string
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
