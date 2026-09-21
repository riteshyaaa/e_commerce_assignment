import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { slugify } from '../utils/slugify';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export class CategoryService {
  static async getAllCategories(includeProductCount = true) {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: includeProductCount
        ? {
            _count: {
              select: { products: true },
            },
          }
        : undefined,
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      productCount: (cat as any)._count?.products ?? 0,
    }));
  }

  static async getCategoryBySlugOrId(identifier: string) {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  static async createCategory(input: CreateCategoryInput) {
    const baseSlug = slugify(input.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const existingName = await prisma.category.findUnique({
      where: { name: input.name },
    });

    if (existingName) {
      throw ApiError.conflict(`A category with the name "${input.name}" already exists`);
    }

    return prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        imageUrl: input.imageUrl || null,
      },
    });
  }

  static async updateCategory(id: string, input: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw ApiError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }

    let slug = category.slug;
    if (input.name && input.name !== category.name) {
      const existingName = await prisma.category.findFirst({
        where: { name: input.name, NOT: { id } },
      });

      if (existingName) {
        throw ApiError.conflict(`A category named "${input.name}" already exists`);
      }

      const baseSlug = slugify(input.name);
      slug = baseSlug;
      let counter = 1;

      while (
        await prisma.category.findFirst({
          where: { slug, NOT: { id } },
        })
      ) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name, slug } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {}),
      },
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }

    if (category._count.products > 0) {
      throw ApiError.conflict(
        `Cannot delete category "${category.name}" because it still contains ${category._count.products} associated product(s). Please reassign or delete these products first.`
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  }
}
