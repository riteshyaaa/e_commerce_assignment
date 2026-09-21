import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../common/Skeleton';
import { Button } from '../common/Button';

interface FeaturedProductsProps {
  products: Product[];
  isLoading?: boolean;
  isFallback?: boolean;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  isLoading = false,
  isFallback = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = [
    { id: 'all', label: isFallback ? 'All Recent' : 'All Featured' },
    { id: 'audio', label: 'Audio' },
    { id: 'wearables-and-watches', label: 'Wearables' },
    { id: 'bags-and-travel', label: 'Bags & Carry' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'smart-accessories', label: 'Tech Gear' },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category?.slug === activeTab;
  });

  return (
    <section className="py-20 bg-zinc-100/60 border-y border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-600 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{isFallback ? 'Explore our latest essentials' : 'Signature Selections'}</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
              {isFallback ? 'Latest Essentials' : 'Featured Essentials'}
            </h2>
          </div>

          {/* Category Tabs & View All button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
              {categories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link to="/products" className="hidden sm:inline-block ml-2">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200">
            <p className="text-zinc-500 text-sm">No products found in this category.</p>
            <Link to="/products" className="mt-4 inline-block">
              <Button size="sm">Browse Full Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} featured={!isFallback && product.featured} />
            ))}
          </div>
        )}

        {/* Bottom Mobile View All Button */}
        <div className="mt-10 text-center sm:hidden">
          <Link to="/products">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All 30+ Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
