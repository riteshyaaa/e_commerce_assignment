import { ProductStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import {
  DashboardStats,
  DashboardAnalytics,
  CategoryAnalytics,
  StockDistribution,
  PriceRangeDistribution,
  CreationTrendPoint,
} from '../types';

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      archivedProducts,
      outOfStockStatusProducts,
      totalCategories,
      allProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
      prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
      prisma.product.count({ where: { status: ProductStatus.ARCHIVED } }),
      prisma.product.count({ where: { status: ProductStatus.OUT_OF_STOCK } }),
      prisma.category.count(),
      prisma.product.findMany({
        select: {
          price: true,
          stock: true,
          status: true,
        },
      }),
    ]);

    let totalInventoryValue = 0;
    let lowStockProducts = 0;
    let zeroStockProducts = 0;
    let healthyStockProducts = 0;

    allProducts.forEach((p) => {
      totalInventoryValue += p.price * p.stock;
      if (p.stock === 0) {
        zeroStockProducts += 1;
      } else if (p.stock <= 5) {
        lowStockProducts += 1;
      } else {
        healthyStockProducts += 1;
      }
    });

    const outOfStockProducts = Math.max(zeroStockProducts, outOfStockStatusProducts);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalCategories,
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
      healthyStockProducts,
      draftProducts,
      archivedProducts,
    };
  }

  static async getAnalytics(): Promise<DashboardAnalytics> {
    const stats = await this.getStats();

    const [categories, products, recentProducts, lowStockAlerts] = await Promise.all([
      prisma.category.findMany({
        include: {
          products: {
            select: {
              price: true,
              stock: true,
            },
          },
        },
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.product.findMany({
        where: {
          stock: { lte: 5 },
          status: { not: ProductStatus.ARCHIVED },
        },
        take: 8,
        orderBy: { stock: 'asc' },
        include: {
          category: {
            select: { name: true },
          },
        },
      }),
    ]);

    // 1. Products by Category
    const productsByCategory: CategoryAnalytics[] = categories.map((cat) => {
      const inventoryValue = cat.products.reduce((acc, p) => acc + p.price * p.stock, 0);
      return {
        name: cat.name,
        slug: cat.slug,
        productCount: cat.products.length,
        inventoryValue: Math.round(inventoryValue),
      };
    }).sort((a, b) => b.productCount - a.productCount);

    // 2. Inventory Distribution
    const totalP = products.length || 1;
    let healthyCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach((p) => {
      if (p.stock === 0 || p.status === ProductStatus.OUT_OF_STOCK) {
        outOfStockCount++;
      } else if (p.stock <= 5) {
        lowStockCount++;
      } else {
        healthyCount++;
      }
    });

    const inventoryDistribution: StockDistribution[] = [
      {
        name: 'Healthy Stock (>5)',
        count: healthyCount,
        percentage: Math.round((healthyCount / totalP) * 100),
      },
      {
        name: 'Low Stock (1–5)',
        count: lowStockCount,
        percentage: Math.round((lowStockCount / totalP) * 100),
      },
      {
        name: 'Out of Stock (0)',
        count: outOfStockCount,
        percentage: Math.round((outOfStockCount / totalP) * 100),
      },
    ];

    // 3. Price Distribution
    let range0to2k = 0;
    let range2kto5k = 0;
    let range5kto10k = 0;
    let range10kPlus = 0;

    products.forEach((p) => {
      if (p.price < 2000) {
        range0to2k++;
      } else if (p.price < 5000) {
        range2kto5k++;
      } else if (p.price < 10000) {
        range5kto10k++;
      } else {
        range10kPlus++;
      }
    });

    const priceDistribution: PriceRangeDistribution[] = [
      { range: '₹0–₹2,000', count: range0to2k },
      { range: '₹2,000–₹5,000', count: range2kto5k },
      { range: '₹5,000–₹10,000', count: range5kto10k },
      { range: '₹10,000+', count: range10kPlus },
    ];

    // 4. Creation Trend (by month/date)
    const trendMap = new Map<string, number>();
    products.forEach((p) => {
      const dateStr = new Date(p.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
    });

    const creationTrend: CreationTrendPoint[] = Array.from(trendMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // If trend is empty or single point, produce a smooth representation
    if (creationTrend.length < 2 && products.length > 0) {
      creationTrend.push({
        date: 'Today',
        count: products.length,
      });
    }

    return {
      stats,
      productsByCategory,
      inventoryDistribution,
      priceDistribution,
      creationTrend,
      recentProducts,
      lowStockAlerts,
    };
  }
}
