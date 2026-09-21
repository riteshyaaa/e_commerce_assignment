import { Prisma, ProductStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { slugify } from '../utils/slugify';
import { ProductFilterQuery, PaginatedResult } from '../types';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';

export class ProductService {
  static async getProducts(query: ProductFilterQuery): Promise<PaginatedResult<any>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const andConditions: Prisma.ProductWhereInput[] = [];

    // Search filter (name, description, SKU)
    if (query.search && typeof query.search === 'string' && query.search.trim()) {
      const searchTerm = query.search.trim();
      andConditions.push({
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { sku: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }

    // Category filter (by id or slug)
    if (query.category && query.category !== 'all') {
      andConditions.push({
        category: {
          OR: [{ id: query.category }, { slug: query.category }],
        },
      });
    }

    // Status filter
    if (query.status) {
      if (query.status === 'IN_STOCK') {
        andConditions.push({
          stock: { gt: 0 },
          status: ProductStatus.ACTIVE,
        });
      } else if (query.status === 'LOW_STOCK') {
        andConditions.push({
          stock: { gt: 0, lte: 5 },
          status: ProductStatus.ACTIVE,
        });
      } else if (query.status === 'OUT_OF_STOCK') {
        andConditions.push({
          OR: [
            { status: ProductStatus.OUT_OF_STOCK },
            { stock: { lte: 0 } },
          ],
        });
      } else if (Object.values(ProductStatus).includes(query.status as ProductStatus)) {
        andConditions.push({
          status: query.status as ProductStatus,
        });
      }
    }

    // Featured filter
    if (query.featured !== undefined && query.featured !== '') {
      if (typeof query.featured === 'string') {
        if (query.featured === 'true' || query.featured === '1') {
          andConditions.push({ featured: true });
        } else if (query.featured === 'false' || query.featured === '0') {
          andConditions.push({ featured: false });
        }
      } else {
        andConditions.push({ featured: Boolean(query.featured) });
      }
    }

    // Price range filters
    const minPrice = query.minPrice !== undefined && query.minPrice !== '' ? Number(query.minPrice) : NaN;
    const maxPrice = query.maxPrice !== undefined && query.maxPrice !== '' ? Number(query.maxPrice) : NaN;

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      const priceCondition: Prisma.FloatFilter = {};
      if (!isNaN(minPrice)) {
        priceCondition.gte = minPrice;
      }
      if (!isNaN(maxPrice)) {
        priceCondition.lte = maxPrice;
      }
      andConditions.push({ price: priceCondition });
    }

    const where: Prisma.ProductWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    // Sort order
    let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
      createdAt: 'desc',
    };

    switch (query.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'featured':
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getProductBySlugOrId(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }

    // Fetch related products from the same category (excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: ProductStatus.ACTIVE,
      },
      take: 4,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      ...product,
      relatedProducts,
    };
  }

  static async createProduct(input: CreateProductInput) {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw ApiError.badRequest('Invalid category specified', 'CATEGORY_NOT_FOUND');
    }

    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({
      where: { sku: input.sku.toUpperCase() },
    });

    if (existingSku) {
      throw ApiError.conflict(`A product with SKU "${input.sku}" already exists`);
    }

    // Generate unique slug
    const baseSlug = slugify(input.name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Determine status if stock is 0 and status is ACTIVE
    let status = input.status || ProductStatus.ACTIVE;
    if (input.stock === 0 && status === ProductStatus.ACTIVE) {
      status = ProductStatus.OUT_OF_STOCK;
    }

    return prisma.product.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        price: input.price,
        compareAtPrice: input.compareAtPrice || null,
        stock: input.stock,
        sku: input.sku.toUpperCase(),
        imageUrl: input.imageUrl,
        status,
        featured: input.featured || false,
        categoryId: input.categoryId,
        images: input.images && input.images.length > 0
          ? {
              create: input.images.map((img, idx) => ({
                url: img.url,
                sortOrder: img.sortOrder ?? idx,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async updateProduct(id: string, input: UpdateProductInput) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }

    // If categoryId is provided, check if it exists
    if (input.categoryId && input.categoryId !== product.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        throw ApiError.badRequest('Invalid category specified', 'CATEGORY_NOT_FOUND');
      }
    }

    // Check SKU uniqueness if changed
    if (input.sku && input.sku.toUpperCase() !== product.sku) {
      const existingSku = await prisma.product.findFirst({
        where: {
          sku: input.sku.toUpperCase(),
          NOT: { id },
        },
      });

      if (existingSku) {
        throw ApiError.conflict(`A product with SKU "${input.sku}" already exists`);
      }
    }

    // Handle slug change if name changed
    let slug = product.slug;
    if (input.name && input.name !== product.name) {
      const baseSlug = slugify(input.name);
      slug = baseSlug;
      let counter = 1;

      while (
        await prisma.product.findFirst({
          where: { slug, NOT: { id } },
        })
      ) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    // Handle status / stock correlation
    let status = input.status !== undefined ? input.status : product.status;
    const finalStock = input.stock !== undefined ? input.stock : product.stock;
    if (finalStock === 0 && status === ProductStatus.ACTIVE) {
      status = ProductStatus.OUT_OF_STOCK;
    } else if (finalStock > 0 && status === ProductStatus.OUT_OF_STOCK && input.status === undefined) {
      status = ProductStatus.ACTIVE;
    }

    // Update images if provided
    if (input.images !== undefined) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });
    }

    return prisma.product.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name, slug } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.compareAtPrice !== undefined ? { compareAtPrice: input.compareAtPrice } : {}),
        ...(input.stock !== undefined ? { stock: input.stock } : {}),
        ...(input.sku ? { sku: input.sku.toUpperCase() } : {}),
        ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
        status,
        ...(input.featured !== undefined ? { featured: input.featured } : {}),
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        ...(input.images !== undefined
          ? {
              images: {
                create: input.images.map((img, idx) => ({
                  url: img.url,
                  sortOrder: img.sortOrder ?? idx,
                })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }

    return prisma.product.delete({
      where: { id },
    });
  }

  static async toggleFeatured(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }

    return prisma.product.update({
      where: { id },
      data: {
        featured: !product.featured,
      },
    });
  }

  static async updateStatus(id: string, status: ProductStatus) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }

    return prisma.product.update({
      where: { id },
      data: { status },
    });
  }
}
