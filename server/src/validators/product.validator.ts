import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

export const productStatusEnum = z.nativeEnum(ProductStatus);

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(120, 'Product name cannot exceed 120 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters')
    .trim(),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be greater than 0'),
  compareAtPrice: z
    .number({ invalid_type_error: 'Compare at price must be a number' })
    .positive('Compare at price must be greater than 0')
    .optional()
    .nullable(),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(40, 'SKU cannot exceed 40 characters')
    .trim()
    .toUpperCase(),
  imageUrl: z.string().url('Invalid image URL format').trim(),
  status: productStatusEnum.default(ProductStatus.ACTIVE),
  featured: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid gallery image URL'),
        sortOrder: z.number().int().default(0),
      })
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdParamSchema = z.object({
  id: z.string().min(1, 'Product identifier is required'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
