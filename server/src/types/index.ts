import { ProductStatus } from '@prisma/client';
import { Request } from 'express';

export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminJwtPayload;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ProductFilterQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  category?: string;
  status?: ProductStatus | 'IN_STOCK' | 'LOW_STOCK' | string;
  featured?: boolean | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'featured' | string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  totalInventoryValue: number;
  healthyStockProducts: number;
  draftProducts: number;
  archivedProducts: number;
}

export interface CategoryAnalytics {
  name: string;
  slug: string;
  productCount: number;
  inventoryValue: number;
}

export interface StockDistribution {
  name: string;
  count: number;
  percentage: number;
}

export interface PriceRangeDistribution {
  range: string;
  count: number;
}

export interface CreationTrendPoint {
  date: string;
  count: number;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  productsByCategory: CategoryAnalytics[];
  inventoryDistribution: StockDistribution[];
  priceDistribution: PriceRangeDistribution[];
  creationTrend: CreationTrendPoint[];
  recentProducts: any[];
  lowStockAlerts: any[];
}
