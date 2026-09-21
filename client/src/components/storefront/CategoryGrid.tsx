import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import { Category } from '../../types';
import { Skeleton } from '../common/Skeleton';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, isLoading = false }) => {
  if (isLoading) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-10">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-600 mb-2">
            <Layers className="w-4 h-4" />
            <span>Curated Disciplines</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
            Shop by Category
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Explore our purposeful product families, engineered for daily commutes, focused work sessions, and modern living.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.slug}`}
            className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-zinc-200/40"
          >
            {/* Background Image with Hover Scale */}
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800" />
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent transition-opacity duration-300 group-hover:from-zinc-950/95" />

            {/* Content info */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-accent-400 uppercase tracking-wider">
                  {(() => {
                    const count = category.productCount ?? category._count?.products;
                    return count !== undefined
                      ? `${count} ${count === 1 ? 'Product' : 'Products'}`
                      : 'Collection';
                  })()}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-zinc-950 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-white group-hover:text-white transition-colors">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-xs text-zinc-300 line-clamp-1 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
