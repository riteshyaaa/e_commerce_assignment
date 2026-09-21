import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';
import { verifyAdminToken } from '../utils/jwt';

export function authenticateAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Invalid authorization header format');
    }

    const decoded = verifyAdminToken(token);
    req.admin = decoded;
    next();
  } catch (error: any) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Session has expired, please log in again'));
    } else if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Invalid authentication token'));
    } else {
      next(ApiError.unauthorized('Authentication failed'));
    }
  }
}
