import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'NOVA — Modern Essentials API',
    version: '1.0.0',
    description:
      'Production-ready REST API for NOVA E-Commerce Storefront and Admin Management System.',
    contact: {
      name: 'NOVA Engineering Team',
      email: 'engineering@nova-store.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Default API Base Path',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Bearer token obtained from /auth/login',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found' },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clx1234567890' },
          name: { type: 'string', example: 'Audio' },
          slug: { type: 'string', example: 'audio' },
          description: { type: 'string', example: 'High-fidelity audio equipment' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
          productCount: { type: 'integer', example: 8 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clx0987654321' },
          name: { type: 'string', example: 'NOVA Pulse Wireless Headphones' },
          slug: { type: 'string', example: 'nova-pulse-wireless-headphones' },
          description: { type: 'string', example: 'Active noise cancellation headphones with 40h battery' },
          price: { type: 'number', example: 7499 },
          compareAtPrice: { type: 'number', example: 9999 },
          stock: { type: 'integer', example: 34 },
          sku: { type: 'string', example: 'NOV-AUD-001' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
          status: { type: 'string', enum: ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'], example: 'ACTIVE' },
          featured: { type: 'boolean', example: true },
          categoryId: { type: 'string', example: 'clx1234567890' },
          rating: { type: 'number', example: 4.8 },
          reviewCount: { type: 'integer', example: 24 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'API Health Check',
        tags: ['Health'],
        responses: {
          200: { description: 'API is healthy and operational' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Admin Login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@nova-store.com' },
                  password: { type: 'string', example: 'AdminPassword123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get Authenticated Admin Profile',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Admin profile returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/products': {
      get: {
        summary: 'List products with search, filters, sorting and pagination',
        tags: ['Products'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'] } },
          { name: 'featured', in: 'query', schema: { type: 'boolean' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'newest', 'oldest', 'name_asc', 'name_desc', 'featured'] } },
        ],
        responses: {
          200: { description: 'Paginated list of products' },
        },
      },
      post: {
        summary: 'Create a new product',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Product created' },
          400: { description: 'Validation failed' },
          409: { description: 'SKU or slug collision' },
        },
      },
    },
    '/products/{id}': {
      get: {
        summary: 'Get product by ID or Slug with related products',
        tags: ['Products'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product details' },
          404: { description: 'Product not found' },
        },
      },
      patch: {
        summary: 'Update product',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product updated' },
        },
      },
      delete: {
        summary: 'Delete product',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product deleted' },
        },
      },
    },
    '/categories': {
      get: {
        summary: 'List all categories with product counts',
        tags: ['Categories'],
        responses: {
          200: { description: 'List of categories' },
        },
      },
      post: {
        summary: 'Create category',
        tags: ['Categories'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Category created' },
        },
      },
    },
    '/dashboard/stats': {
      get: {
        summary: 'Get live KPI statistics',
        tags: ['Dashboard'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'KPI data' },
        },
      },
    },
    '/dashboard/analytics': {
      get: {
        summary: 'Get comprehensive analytics for charts and reports',
        tags: ['Dashboard'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Analytics data' },
        },
      },
    },
  },
};

const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'NOVA API Documentation' }));

export default router;
