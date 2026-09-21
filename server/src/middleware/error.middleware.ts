import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { env } from '../config/env';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code,
        details: err.details,
      },
    });
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[]) || [];
        const field = target.length > 0 ? target.join(', ') : 'field';
        return res.status(409).json({
          success: false,
          message: `A record with this ${field} already exists`,
          error: {
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
            target,
          },
        });
      }
      case 'P2025': {
        return res.status(404).json({
          success: false,
          message: 'Requested record was not found in the database',
          error: {
            code: 'RECORD_NOT_FOUND',
          },
        });
      }
      case 'P2003': {
        return res.status(400).json({
          success: false,
          message: 'Foreign key constraint failed. Related record cannot be modified or deleted.',
          error: {
            code: 'FOREIGN_KEY_CONSTRAINT_FAILED',
          },
        });
      }
      default: {
        return res.status(400).json({
          success: false,
          message: 'Database operation failed',
          error: {
            code: `PRISMA_${err.code}`,
          },
        });
      }
    }
  }

  // Handle Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format provided to database',
      error: {
        code: 'PRISMA_VALIDATION_ERROR',
      },
    });
  }

  // General unhandled exceptions
  console.error('[UNHANDLED ERROR]:', err);

  const statusCode = err.statusCode || 500;
  const message = env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
}
