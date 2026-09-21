import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Image as ImageIcon, Sparkles, RefreshCw, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Product, ProductStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

const productFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(40, 'SKU cannot exceed 40 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compareAtPrice: z.coerce
    .number()
    .positive('Compare at price must be positive')
    .optional()
    .nullable()
    .or(z.literal('')),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  status: z.enum([
    'ACTIVE',
    'IN_STOCK',
    'LOW_STOCK',
    'OUT_OF_STOCK',
    'DRAFT',
    'ARCHIVED',
  ] as const),
  featured: z.boolean().default(false),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  galleryImages: z.array(z.object({ url: z.string().url('Must be a valid URL') })).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | null;
  onSuccess?: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productId,
  onSuccess,
}) => {
  const isEditMode = Boolean(productId);
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories for selector
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.getAll,
    enabled: isOpen,
  });

  // Fetch existing product data if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => (productId ? api.products.getByIdOrSlug(productId) : Promise.reject('No ID')),
    enabled: isOpen && isEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      sku: '',
      categoryId: '',
      price: 0,
      compareAtPrice: null,
      stock: 10,
      status: 'ACTIVE',
      featured: false,
      description: '',
      imageUrl: '',
      galleryImages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'galleryImages',
  });

  const currentImageUrl = watch('imageUrl');

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && existingProduct) {
      reset({
        name: existingProduct.name,
        sku: existingProduct.sku,
        categoryId: existingProduct.categoryId,
        price: existingProduct.price,
        compareAtPrice: existingProduct.compareAtPrice || null,
        stock: existingProduct.stock,
        status: existingProduct.status,
        featured: existingProduct.featured,
        description: existingProduct.description,
        imageUrl: existingProduct.imageUrl,
        galleryImages: existingProduct.images
          ? existingProduct.images.map((img) => ({ url: img.url || (img as any).imageUrl || '' }))
          : [],
      });
    } else if (!isEditMode && isOpen) {
      reset({
        name: '',
        sku: '',
        categoryId: categories[0]?.id || '',
        price: 999,
        compareAtPrice: null,
        stock: 25,
        status: 'ACTIVE',
        featured: false,
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000',
        galleryImages: [],
      });
    }
  }, [isEditMode, existingProduct, isOpen, reset, categories]);

  const generateRandomSKU = () => {
    const catPrefix = 'NOV';
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    setValue('sku', `${catPrefix}-${randomHex}-${randomNum}`);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload: any = {
        name: data.name.trim(),
        sku: data.sku.trim().toUpperCase(),
        categoryId: data.categoryId,
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
        stock: Number(data.stock),
        status: data.status,
        featured: data.featured,
        description: data.description.trim(),
        imageUrl: data.imageUrl.trim(),
        images: data.galleryImages && data.galleryImages.length > 0
          ? data.galleryImages.map((img, idx) => ({
              url: img.url.trim(),
              sortOrder: idx,
            }))
          : [],
      };

      if (isEditMode && productId) {
        await api.products.update(productId, payload);
        success(`Product "${data.name}" updated successfully.`, 'Product Updated');
      } else {
        await api.products.create(payload);
        success(`Product "${data.name}" created successfully.`, 'Product Created');
      }

      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-analytics'] });
      if (productId) {
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      error(err.message || 'Failed to persist product.', 'Save Error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Catalog Product' : 'Create New Product'}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Title"
            required
            placeholder="e.g. Apex Minimalist Wireless Headphones"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                SKU Identifier <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomSKU}
                className="text-[10px] font-bold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-Gen
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. NOV-APX-801"
              className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 uppercase font-mono placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              {...register('sku')}
            />
            {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
          </div>
        </div>

        {/* Category & Status Selection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Taxonomy Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              {...register('categoryId')}
            >
              <option value="" disabled>
                Select category...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Catalog Status
            </label>
            <select
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              {...register('status')}
            >
              <option value="ACTIVE">ACTIVE (Storefront Visible)</option>
              <option value="IN_STOCK">IN_STOCK (Warehouse Ready)</option>
              <option value="LOW_STOCK">LOW_STOCK (Warning Trigger)</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK (Sold Out)</option>
              <option value="DRAFT">DRAFT (Unpublished)</option>
              <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
            </select>
          </div>
        </div>

        {/* Pricing & Inventory Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Selling Price (₹)"
            type="number"
            step="1"
            required
            placeholder="2999"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label="Compare Price (₹)"
            type="number"
            step="1"
            placeholder="3999 (Optional strike-through)"
            error={errors.compareAtPrice?.message}
            {...register('compareAtPrice')}
          />

          <Input
            label="Warehouse Stock Units"
            type="number"
            step="1"
            required
            placeholder="25"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </div>

        {/* Featured Toggle Checkbox */}
        <div className="flex items-center gap-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl">
          <input
            type="checkbox"
            id="featured"
            className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900"
            {...register('featured')}
          />
          <label htmlFor="featured" className="text-xs font-bold text-zinc-800 cursor-pointer select-none">
            Spotlight on Homepage Carousel & Editorial Hero Picks
          </label>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Full Product Overview & Specifications <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describe acoustic materials, structural engineering, battery life, weight, and accessories..."
            className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Primary Image URL & Live Thumbnail Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Primary Cover Image URL <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                {...register('imageUrl')}
              />
              {errors.imageUrl && (
                <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
              )}
            </div>

            {currentImageUrl && (
              <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                <img
                  src={currentImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Gallery Image URLs Array */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
              Additional Gallery Angles ({fields.length})
            </label>
            <button
              type="button"
              onClick={() => append({ url: '' })}
              className="text-xs font-bold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Angle
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                  {...register(`galleryImages.${index}.url` as const)}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="font-bold shadow-md"
          >
            {isEditMode ? 'Save Product Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
