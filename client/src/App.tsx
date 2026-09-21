import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { StorefrontLayout } from './components/layout/StorefrontLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ScrollToTop } from './components/common/ScrollToTop';

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { CatalogPage } from './pages/storefront/CatalogPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { CartPage } from './pages/storefront/CartPage';
import { TrackOrderPage } from './pages/storefront/TrackOrderPage';
import { ReturnsPage } from './pages/storefront/ReturnsPage';
import { WarrantyPage } from './pages/storefront/WarrantyPage';
import { PrivacyPage } from './pages/storefront/PrivacyPage';
import { TermsPage } from './pages/storefront/TermsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardOverviewPage } from './pages/admin/DashboardOverviewPage';
import { ProductsListPage } from './pages/admin/ProductsListPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { Button } from './components/common/Button';

// 404 Not Found Page Component
const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
    <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
      <Package className="w-8 h-8" />
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-1">
      404 Error
    </span>
    <h1 className="font-display font-black text-3xl text-zinc-900 mb-2">Page Not Found</h1>
    <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
      The requested route or product catalog item does not exist or has been relocated.
    </p>
    <Link to="/">
      <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
        Return to Home
      </Button>
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Storefront Layout & Public Routes */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Authentication (Standalone) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Console Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverviewPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Routes>
    </>
  );
};
