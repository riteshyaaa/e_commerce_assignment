import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Package,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Product, ProductStatus, ProductFilters } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ProductFormModal } from '../../components/admin/ProductFormModal';

export const ProductsListPage: React.FC = () => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  // Filter & Pagination State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sort, setSort] = useState<ProductFilters['sort']>('newest');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories for Filter Dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.getAll,
  });

  // Fetch Products with filters
  const {
    data: productsData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin-products', { page, limit, search, category: selectedCategory, status: selectedStatus, sort }],
    queryFn: () =>
      api.products.getAll({
        page,
        limit,
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        status: (selectedStatus as ProductStatus) || undefined,
        sort,
      }),
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  // Toggle Featured Quick Action
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      api.products.update(id, { featured }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      success(
        `Product marked as ${variables.featured ? 'Featured' : 'Standard'}.`,
        'Catalog Updated'
      );
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update featured flag.', 'Update Error');
    },
  });

  // Inline Status Change Quick Action
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) =>
      api.products.update(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-analytics'] });
      success(`Status changed to ${variables.status}.`, 'Status Updated');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to change catalog status.', 'Update Error');
    },
  });

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await api.products.delete(deletingProduct.id);
      success(`Product "${deletingProduct.name}" removed from catalog.`, 'Product Deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete product.', 'Deletion Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStockBadge = (stock: number, status: ProductStatus) => {
    if (stock <= 0 || status === 'OUT_OF_STOCK') {
      return (
        <Badge variant="danger" size="sm">
          0 Out of Stock
        </Badge>
      );
    }
    if (stock <= 5) {
      return (
        <Badge variant="warning" size="sm">
          {stock} Low Units
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="sm">
        {stock} Units
      </Badge>
    );
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge variant="danger" size="sm">Out of Stock</Badge>;
      case 'DRAFT':
        return <Badge variant="neutral" size="sm">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge variant="neutral" size="sm">Archived</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
            Inventory & Catalog
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Manage your master SKU list, live catalog visibility, pricing, and warehouse counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching && !isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingProductId(null);
              setIsFormModalOpen(true);
            }}
            className="font-bold shadow-md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Product
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white"
            />
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active (Storefront)</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DRAFT">Draft (Hidden)</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as ProductFilters['sort']);
              setPage(1);
            }}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="price_asc">Sort: Price Low → High</option>
            <option value="price_desc">Sort: Price High → Low</option>
            <option value="name_asc">Sort: Title A → Z</option>
            <option value="name_desc">Sort: Title Z → A</option>
            <option value="featured">Sort: Featured First</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-zinc-300 animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-zinc-400">Loading catalog items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm mb-1">No products match your criteria</h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-4">
              Try adjusting your search queries, clearing category filters, or create a brand new SKU.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setSelectedStatus('');
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product / SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Status & Visibility</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/60 transition-colors">
                    {/* Product & SKU */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-zinc-900 truncate">{product.name}</div>
                          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <span>{product.sku}</span>
                            <span>•</span>
                            <a
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent-600 hover:text-accent-700 inline-flex items-center gap-0.5"
                            >
                              Storefront <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      {product.category ? (
                        <span className="font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-lg text-[11px]">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-900">{formatCurrency(product.price)}</div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="text-[10px] text-zinc-400 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      {getStockBadge(product.stock, product.status)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={product.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: product.id,
                            status: e.target.value as ProductStatus,
                          })
                        }
                        className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-zinc-800 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-xs"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: product.id,
                            featured: !product.featured,
                          })
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.featured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100'
                        }`}
                        title={product.featured ? 'Featured on Homepage' : 'Standard Item'}
                      >
                        <Star
                          className={`w-4 h-4 ${product.featured ? 'fill-amber-400' : ''}`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProductId(product.id);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="py-3 px-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
            <div>
              Showing <strong className="font-bold text-zinc-900">{products.length}</strong> of{' '}
              <strong className="font-bold text-zinc-900">{pagination.total}</strong> products
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <span className="px-3 text-xs font-bold text-zinc-700 select-none">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      {isFormModalOpen && (
        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingProductId(null);
          }}
          productId={editingProductId}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingProduct && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProduct(null);
          }}
          title="Confirm SKU Deletion"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="font-bold block mb-1">Permanent Removal Warning</strong>
                Are you sure you want to delete{' '}
                <span className="font-mono font-bold">{deletingProduct.name}</span> (SKU:{' '}
                {deletingProduct.sku})? This will immediately remove it from all storefront catalog
                listings and carts.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingProduct(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteConfirm}
                loading={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Delete SKU
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
