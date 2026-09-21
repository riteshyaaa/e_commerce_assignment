import {
  ApiResponse,
  AuthResponse,
  Category,
  DashboardAnalytics,
  DashboardStats,
  Product,
  ProductFilters,
  ProductsResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private getHeaders(contentType: boolean = true): HeadersInit {
    const headers: HeadersInit = {};
    if (contentType) {
      headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('nova_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let baseUrl = (API_BASE_URL || '/api').trim();

    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    let fullUrl: string;
    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
      fullUrl = `${baseUrl}${cleanPath}`;
    } else {
      const cleanBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
      fullUrl = `${window.location.origin}${cleanBase}${cleanPath}`;
    }

    const url = new URL(fullUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: 'Failed to parse JSON response from server',
      data: null as unknown as T,
    }));

    if (!response.ok || !data.success) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data.data;
  }

  // Generic request methods
  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // ==========================================
  // Typed Domain APIs
  // ==========================================

  // Authentication
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.post<AuthResponse>('/auth/login', credentials),
    getProfile: () => this.get<AuthResponse['admin']>('/auth/me'),
  };

  // Products
  products = {
    getAll: async (filters?: ProductFilters): Promise<ProductsResponse> => {
      const url = this.buildUrl('/products', filters as Record<string, string | number | boolean | undefined>);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch products');
      }

      return {
        products: json.data as Product[],
        pagination: json.pagination,
      };
    },
    getByIdOrSlug: (idOrSlug: string) =>
      this.get<Product & { relatedProducts?: Product[] }>(`/products/${idOrSlug}`),
    create: (data: Partial<Product> & { images?: string[] }) =>
      this.post<Product>('/products', data),
    update: (id: string, data: Partial<Product> & { images?: string[] }) =>
      this.patch<Product>(`/products/${id}`, data),
    delete: (id: string) =>
      this.delete<{ id: string; name: string }>(`/products/${id}`),
  };

  // Categories
  categories = {
    getAll: () => this.get<Category[]>('/categories'),
    getByIdOrSlug: (idOrSlug: string) => this.get<Category>(`/categories/${idOrSlug}`),
    create: (data: { name: string; slug?: string; description?: string | null; imageUrl?: string | null }) =>
      this.post<Category>('/categories', data),
    update: (id: string, data: { name?: string; slug?: string; description?: string | null; imageUrl?: string | null }) =>
      this.patch<Category>(`/categories/${id}`, data),
    delete: (id: string) => this.delete<{ id: string; name: string }>(`/categories/${id}`),
  };

  // Dashboard
  dashboard = {
    getStats: () => this.get<DashboardStats>('/dashboard/stats'),
    getAnalytics: () => this.get<DashboardAnalytics>('/dashboard/analytics'),
  };

  // Newsletter
  newsletter = {
    subscribe: (email: string) =>
      this.post<{ alreadySubscribed: boolean; message: string; subscriber?: { id: string; email: string; createdAt: string } }>('/newsletter/subscribe', { email }),
  };
}

export const api = new ApiClient();
