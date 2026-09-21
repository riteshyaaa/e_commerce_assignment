import React from 'react';
import { Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 border-t border-zinc-200 mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Your Setup</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-zinc-900">
            Complementary Essentials
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
