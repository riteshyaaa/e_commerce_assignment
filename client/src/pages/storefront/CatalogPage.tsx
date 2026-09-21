import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Filter,
  Package,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { ProductSortOption } from '../../types';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract query parameters from URL
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const status = searchParams.get('status') || '';
  const sortBy = (searchParams.get('sortBy') as ProductSortOption) || 'featured';

  // Local state for debounced search and price inputs
  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  // Synchronize local search input with URL search param
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateFilter('search', searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Categories for filter list
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.getAll,
  });

  // Fetch Products based on current filters
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['catalog-products', { page, search, categorySlug, minPrice, maxPrice, status, sortBy }],
    queryFn: () =>
      api.products.getAll({
        page,
        limit: 12,
        search: search || undefined,
        category: categorySlug || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        status: status ? (status as any) : undefined,
        sort: sortBy,
      }),
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  // Helper to update URL search parameters
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page to 1 when changing filters (unless changing page itself)
    if (key !== 'page') {
      params.set('page', '1');
    }
    setSearchParams(params, { replace: true });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (minPriceInput) params.set('minPrice', minPriceInput);
    else params.delete('minPrice');
    if (maxPriceInput) params.set('maxPrice', maxPriceInput);
    else params.delete('maxPrice');
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({}, { replace: true });
  };

  const activeFiltersCount = [
    search,
    categorySlug,
    minPrice,
    maxPrice,
    status,
    sortBy !== 'featured' ? sortBy : '',
  ].filter(Boolean).length;

  const currentCategoryObj = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-600 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Curated Catalog</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-900 tracking-tight">
          {currentCategoryObj ? currentCategoryObj.name : 'All Modern Essentials'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
          {currentCategoryObj?.description ||
            'Explore our full collection of 30 minimalist accessories, acoustics, backpacks, and timepieces.'}
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <button
          onClick={() => updateFilter('category', '')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            !categorySlug
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilter('category', cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categorySlug === cat.slug
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid Layout with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-accent-600 hover:text-accent-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Keywords..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    updateFilter('search', '');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                  !categorySlug ? 'bg-zinc-100 text-zinc-900 font-bold' : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter('category', c.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    categorySlug === c.slug
                      ? 'bg-zinc-100 text-zinc-900 font-bold'
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <span>{c.name}</span>
                  {c._count?.products !== undefined && (
                    <span className="text-[10px] text-zinc-400">{c._count.products}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Price Range (₹)
            </label>
            <form onSubmit={handlePriceApply} className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                />
              </div>
              <Button type="submit" variant="outline" size="sm" className="w-full text-xs">
                Apply Price
              </Button>
            </form>
          </div>

          {/* Availability Status Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Availability
            </label>
            <div className="space-y-1">
              {[
                { label: 'All Items', val: '' },
                { label: 'In Stock Only', val: 'IN_STOCK' },
                { label: 'Low Stock Alert', val: 'LOW_STOCK' },
              ].map((st) => (
                <button
                  key={st.val}
                  onClick={() => updateFilter('status', st.val)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                    status === st.val
                      ? 'bg-zinc-100 text-zinc-900 font-bold'
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area (3 Columns on Large Screen) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Top Control Bar: Total Count, Sorting & Mobile Filter Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-bold hover:bg-zinc-200"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              <span className="text-xs text-zinc-500">
                Showing{' '}
                <span className="font-bold text-zinc-900">
                  {pagination.total > 0 ? (page - 1) * pagination.limit + 1 : 0} -{' '}
                  {Math.min(page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-bold text-zinc-900">{pagination.total}</span> products
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="catalog-sort" className="text-xs font-semibold text-zinc-500 whitespace-nowrap flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort By:</span>
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 rounded-xl px-3 py-1.5 focus:outline-none focus:border-zinc-900"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="name_asc">Alphabetical (A - Z)</option>
                <option value="name_desc">Alphabetical (Z - A)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-200 text-zinc-800 text-xs font-semibold">
                  Search: "{search}"
                  <button onClick={() => updateFilter('search', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categorySlug && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-200 text-zinc-800 text-xs font-semibold">
                  Category: {currentCategoryObj?.name || categorySlug}
                  <button onClick={() => updateFilter('category', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-200 text-zinc-800 text-xs font-semibold">
                  Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                  <button
                    onClick={() => {
                      setMinPriceInput('');
                      setMaxPriceInput('');
                      const p = new URLSearchParams(searchParams);
                      p.delete('minPrice');
                      p.delete('maxPrice');
                      setSearchParams(p);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {status && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-200 text-zinc-800 text-xs font-semibold">
                  Status: {status.replace('_', ' ')}
                  <button onClick={() => updateFilter('status', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-xs text-accent-600 hover:underline font-semibold ml-1"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Product Grid / Skeletons / Empty State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-zinc-200">
              <EmptyState
                icon={<Package className="w-8 h-8 text-zinc-400" />}
                title="No products match your criteria"
                description="Try adjusting your keywords, broadening price bounds, or clearing active filters."
                actionText="Reset All Filters"
                onAction={resetAllFilters}
              />
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
                isFetching ? 'opacity-60' : 'opacity-100'
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                meta={pagination}
                onPageChange={(p) => updateFilter('page', p.toString())}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <h3 className="font-bold text-base text-zinc-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateFilter('category', '');
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      !categorySlug ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateFilter('category', c.slug);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        categorySlug === c.slug ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Availability
                </label>
                <div className="space-y-1">
                  {[
                    { label: 'All Items', val: '' },
                    { label: 'In Stock Only', val: 'IN_STOCK' },
                    { label: 'Low Stock Alert', val: 'LOW_STOCK' },
                  ].map((st) => (
                    <button
                      key={st.val}
                      onClick={() => {
                        updateFilter('status', st.val);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        status === st.val ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full text-zinc-500"
                onClick={() => {
                  resetAllFilters();
                  setMobileFiltersOpen(false);
                }}
              >
                Reset All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
