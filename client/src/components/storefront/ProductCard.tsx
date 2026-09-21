import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Star, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, calculateDiscountPercentage } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop';

  const discountPercent = calculateDiscountPercentage(product.price, product.compareAtPrice);
  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const added = addToCart(product, 1);
    if (added) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        setIsAdding(false);
      }, 1200);
    } else {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-zinc-300 transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-zinc-100 flex items-center justify-center cursor-pointer"
      >
        <img
          src={imgSrc || fallbackImage}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(fallbackImage)}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-1 rounded-lg bg-zinc-950 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Stock Status Indicator Pill */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" size="sm">
              Only {product.stock} Left
            </Badge>
          ) : null}
        </div>

        {/* Quick Add overlay button on desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-98'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
              {product.category?.name || 'Essential'}
            </span>

            {product.rating && (
              <div className="flex items-center gap-1 text-zinc-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-xs">{product.rating.toFixed(1)}</span>
                {product.reviewCount && (
                  <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.slug}`}
            className="font-display font-bold text-sm text-zinc-900 line-clamp-1 hover:text-accent-600 transition-colors"
          >
            {product.name}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Mobile Add Button */}
        <div className="pt-3.5 mt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-base text-zinc-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile direct Add button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            aria-label={`Add ${product.name} to cart`}
            className={`sm:hidden p-2 rounded-xl transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-zinc-100 text-zinc-300'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
