import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  FolderPlus,
  AlertTriangle,
  RefreshCw,
  Package,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Category } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { slugify } from '../../lib/utils';

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(60, 'Slug cannot exceed 60 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
  imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const CategoriesPage: React.FC = () => {
  const { success, error, warning } = useToast();
  const queryClient = useQueryClient();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories
  const {
    data: categories = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
    },
  });

  const categoryName = watch('name');

  // Auto-fill slug when creating
  useEffect(() => {
    if (!editingCategory && categoryName) {
      setValue('slug', slugify(categoryName));
    }
  }, [categoryName, editingCategory, setValue]);

  // Open modal in create or edit mode
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        slug: '',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const payload = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description ? data.description.trim() : null,
        imageUrl: data.imageUrl ? data.imageUrl.trim() : null,
      };

      if (editingCategory) {
        await api.categories.update(editingCategory.id, payload);
        success(`Category "${data.name}" updated successfully.`, 'Category Updated');
      } else {
        await api.categories.create(payload);
        success(`Category "${data.name}" created successfully.`, 'Category Created');
      }

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-analytics'] });
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to persist category.', 'Save Error');
    }
  };

  const handleDeletePrompt = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    if (deletingCategory.productCount && deletingCategory.productCount > 0) {
      warning(
        `Cannot delete "${deletingCategory.name}" because it contains ${deletingCategory.productCount} active products. Reassign or remove the products first.`,
        'Protection Rule'
      );
      setIsDeleteModalOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await api.categories.delete(deletingCategory.id);
      success(`Category "${deletingCategory.name}" deleted.`, 'Category Deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-analytics'] });
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete category.', 'Deletion Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
            Taxonomy & Categories
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Organize catalog hierarchy, manage navigational classifications, and monitor department
            allocations.
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
            onClick={() => handleOpenModal()}
            className="font-bold shadow-md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 text-zinc-300 animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-zinc-400">Loading taxonomy classifications...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-zinc-900 text-sm mb-1">No categories configured</h3>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-4">
            Group your products by creating high-level taxonomy departments (e.g. Audio, Desk, Wearables).
          </p>
          <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
            Create First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const hasProducts = (cat.productCount || 0) > 0;
            return (
              <div
                key={cat.id}
                className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {cat.imageUrl ? (
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                          <Layers className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-zinc-900 text-sm leading-snug">{cat.name}</h3>
                        <span className="text-[11px] font-mono text-zinc-400">/{cat.slug}</span>
                      </div>
                    </div>

                    <Badge variant={hasProducts ? 'accent' : 'neutral'} size="sm">
                      {cat.productCount || 0} SKUs
                    </Badge>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-2 mb-4 leading-relaxed">
                    {cat.description || 'No specific overview provided for this department category.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <a
                    href={`/products?category=${cat.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
                  >
                    View in Catalog <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(cat)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Create Taxonomy Category'}
          size="md"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Category Name"
              required
              placeholder="e.g. Workspace Audio"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="URL Slug"
              required
              placeholder="workspace-audio"
              error={errors.slug?.message}
              {...register('slug')}
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Cover Image URL
              </label>
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Overview & Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe what items belong in this department..."
                className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
                className="font-bold shadow-md"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal with Protection Rules */}
      {isDeleteModalOpen && deletingCategory && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingCategory(null);
          }}
          title="Delete Category"
          size="sm"
        >
          <div className="space-y-4">
            {deletingCategory.productCount && deletingCategory.productCount > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Deletion Protection Active
                </div>
                <p className="text-xs leading-relaxed">
                  The category <strong>"{deletingCategory.name}"</strong> cannot be removed because{' '}
                  <strong>{deletingCategory.productCount} active products</strong> are currently assigned to it.
                  Please reassign or delete those products first before removing this category.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Confirm Removal
                </div>
                <p className="text-xs leading-relaxed">
                  Are you sure you want to permanently delete category{' '}
                  <strong>"{deletingCategory.name}"</strong>? This action cannot be undone.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingCategory(null);
                }}
                disabled={isDeleting}
              >
                {deletingCategory.productCount && deletingCategory.productCount > 0 ? 'Close' : 'Cancel'}
              </Button>

              {(!deletingCategory.productCount || deletingCategory.productCount === 0) && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDeleteConfirm}
                  loading={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Delete Category
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
