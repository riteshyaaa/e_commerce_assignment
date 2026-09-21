import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

export const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 12)),
  search: z.string().optional().transform((val) => val?.trim()),
  category: z.string().optional().transform((val) => val?.trim()),
  status: z.nativeEnum(ProductStatus).optional(),
  featured: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'oldest', 'name_asc', 'name_desc', 'featured'])
    .optional()
    .default('newest'),
});

export type ProductQueryParams = z.infer<typeof productQuerySchema>;
