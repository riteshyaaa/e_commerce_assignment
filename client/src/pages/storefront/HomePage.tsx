import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { HeroSection } from '../../components/storefront/HeroSection';
import { CategoryGrid } from '../../components/storefront/CategoryGrid';
import { FeaturedProducts } from '../../components/storefront/FeaturedProducts';
import { ValueProps } from '../../components/storefront/ValueProps';
import { PromoBanner } from '../../components/storefront/PromoBanner';

export const HomePage: React.FC = () => {
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.getAll,
  });

  // Fetch featured products
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.products.getAll({ featured: true, limit: 12 }),
  });

  const rawFeatured = featuredData?.products || [];
  const hasFeatured = rawFeatured.length > 0;

  // Fallback query for recent active products if no products are marked as featured
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-active-products'],
    queryFn: () => api.products.getAll({ limit: 12, sort: 'newest' }),
    enabled: !featuredLoading && !hasFeatured,
  });

  const displayProducts = hasFeatured ? rawFeatured : (recentData?.products || []);
  const isLoading = featuredLoading || (!hasFeatured && recentLoading);
  const isFallback = !featuredLoading && !hasFeatured && (recentData?.products?.length ?? 0) > 0;

  return (
    <div className="flex flex-col">
      {/* 1. Hero Editorial Section */}
      <HeroSection />

      {/* 2. Visual Category Grid */}
      <CategoryGrid categories={categories} isLoading={categoriesLoading} />

      {/* 3. Featured Products Gallery / Intelligent Fallback */}
      <FeaturedProducts
        products={displayProducts}
        isLoading={isLoading}
        isFallback={isFallback}
      />

      {/* 4. Value Propositions ("Why NOVA?") */}
      <ValueProps />

      {/* 5. Promotional Dark Banner */}
      <PromoBanner />
    </div>
  );
};
