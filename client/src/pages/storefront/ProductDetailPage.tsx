import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Package,
  Layers,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, calculateDiscountPercentage } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { RelatedProducts } from '../../components/storefront/RelatedProducts';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { success, info } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Fetch Product by Slug or ID
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => (slug ? api.products.getByIdOrSlug(slug) : Promise.reject('No slug')),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-zinc-900 mb-2">Product Not Found</h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
          The essential item you are seeking may have been retired, renamed, or is unavailable.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // Gallery images array
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url || img.imageUrl || '')
      : [product.imageUrl];

  const currentMainImage = galleryImages[selectedImageIndex] || product.imageUrl;
  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && product.stock <= 5;
  const discountPercent = calculateDiscountPercentage(product.price, product.compareAtPrice);

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    const added = addToCart(product, quantity);
    if (added) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        setIsAdding(false);
      }, 1500);
    } else {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, quantity);
    if (added) {
      navigate('/cart');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    info('Product link copied to clipboard!', 'Link Copied');
  };

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-zinc-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-zinc-900 transition-colors">
          Catalog
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              to={`/products?category=${product.category.slug}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Two-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4 sticky top-24">
          {/* Main Selected Image Stage */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-zinc-200 shadow-md group">
            <img
              src={currentMainImage || fallbackImage}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  Save {discountPercent}%
                </span>
              )}
              {product.featured && (
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  Featured
                </span>
              )}
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-zinc-700 hover:text-zinc-900 shadow-md transition-colors"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-zinc-900 shadow-md scale-95'
                      : 'border-zinc-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl || fallbackImage}
                    alt={`${product.name} preview ${index + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs, Price, Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-600">
                {product.category?.name || 'Essential'}
              </span>
              <span className="text-xs font-mono text-zinc-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews */}
            {product.rating && (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-zinc-200 text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-800">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                {product.reviewCount && (
                  <span className="text-xs text-zinc-400">({product.reviewCount} customer reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing Row & Compare Discount */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-3xl text-zinc-900">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm font-semibold text-zinc-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Stock status indicator pill */}
            <div>
              {isOutOfStock ? (
                <Badge variant="danger" size="md">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="warning" size="md">
                  Only {product.stock} Units Left
                </Badge>
              ) : (
                <Badge variant="success" size="md">
                  In Stock • Ready to Ship
                </Badge>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Overview
            </h4>
            <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selection & Cart Actions */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-2 border-t border-zinc-200">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Quantity
                </label>
                <div className="flex items-center border border-zinc-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-zinc-900 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-zinc-400">
                  Total:{' '}
                  <strong className="text-zinc-800 font-bold">
                    {formatCurrency(product.price * quantity)}
                  </strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full font-bold shadow-lg ${
                    justAdded ? 'bg-emerald-600 hover:bg-emerald-600' : ''
                  }`}
                  leftIcon={
                    justAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )
                  }
                >
                  {justAdded ? 'Added to Bag!' : 'Add to Bag'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full font-bold bg-white hover:bg-zinc-100 border-zinc-300"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          )}

          {/* Value Accordions / Guarantees */}
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <Truck className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-zinc-900">Complimentary Express Shipping</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Orders over ₹2,999 qualify for tracked delivery in 2-4 business days.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <RotateCcw className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-zinc-900">30-Day Risk-Free Returns</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Experience it in your routine. Seamless returns with doorstep pickup.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <Shield className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-zinc-900">2-Year NOVA Extended Warranty</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Full coverage against manufacturing defects and structural failures.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <RelatedProducts products={product.relatedProducts} />
      )}
    </div>
  );
};
