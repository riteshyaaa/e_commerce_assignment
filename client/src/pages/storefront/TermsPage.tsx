import React from 'react';
import { FileText, Scale, ShoppingBag, AlertTriangle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-white font-medium">Terms of Service</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Last Updated: September 2026. Please review the operational terms governing your use of NOVA Modern Essentials storefront and services.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <Scale className="w-5 h-5 text-accent-500" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p>
              By browsing, accessing, or placing orders via the NOVA Modern Essentials digital storefront, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <ShoppingBag className="w-5 h-5 text-accent-500" />
              <h2>2. Product Pricing & Inventory Accuracy</h2>
            </div>
            <p>
              All prices listed on NOVA are in Indian Rupees (INR, ₹) inclusive of applicable goods and services taxes unless expressly stated otherwise. While we maintain rigorous real-time PostgreSQL inventory tracking, in the rare event of an unexpected stock discrepancy, we reserve the right to cancel or adjust impacted orders with full immediate refund.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <AlertTriangle className="w-5 h-5 text-accent-500" />
              <h2>3. Product Usage & Safety</h2>
            </div>
            <p>
              NOVA products must be operated in accordance with the included user guides. Do not expose electronic components to excessive moisture, submergence, or extreme heat beyond rated ingress protection (IP) specifications.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <FileText className="w-5 h-5 text-accent-500" />
              <h2>4. Intellectual Property</h2>
            </div>
            <p>
              The visual styling, typography, brand marks, photography, product schematics, and design language rendered across this platform are the exclusive intellectual property of NOVA Modern Essentials and protected by international copyright laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};