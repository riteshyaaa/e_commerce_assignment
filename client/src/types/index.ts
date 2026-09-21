export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'ARCHIVED';

export type ProductSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'featured';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  imageUrl?: string; // alias for compatibility
  sortOrder: number;
  productId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  sku: string;
  imageUrl: string;
  status: ProductStatus;
  featured: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  relatedProducts?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ProductStatus;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'featured';
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
  recentProducts: (Product & { category?: { name: string; slug: string } })[];
  lowStockAlerts: (Product & { category?: { name: string } })[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
  error?: {
    code: string;
    details?: unknown;
  };
}
