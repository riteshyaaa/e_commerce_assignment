import React from 'react';
import { RotateCcw, ShieldCheck, Truck, Clock, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReturnsPage: React.FC = () => {
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
            <span className="text-zinc-900 dark:text-white font-medium">Returns & Exchanges</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
            30-Day Risk-Free Returns
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            We build products engineered to stand the test of time. If any NOVA essential does not fit your workflow, return or exchange it effortlessly.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-500 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">30-Day Window</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Initiate a return within 30 days of product delivery with original packaging and included accessories.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-500 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Complimentary Pickup</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              We arrange doorstep courier pickup from your address with zero reverse logistics shipping fees.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-500 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Instant Refund</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Refunds are processed to the original payment source (UPI, Card, Net Banking) within 48 hours of warehouse scan.
            </p>
          </div>
        </div>

        {/* Process Flow */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-white mb-6">
            How to Return or Exchange an Item
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Initiate Request</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Navigate to your order tracking page or contact support with your NOVA order number (NOV-XXXX) and state your reason for return or preferred exchange model.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Repack Securely</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Place the product in its original matte black packaging alongside supplied cables, magnetic adapters, or straps.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Doorstep Courier Handover</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Our logistics partner will verify the tamper seal and collect the shipment from your registered address.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Verification & Quick Credit</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Once our technical inspection team verifies the item at our Bengaluru fulfillment facility, credit is released immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">What items cannot be returned?</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Custom monogrammed products or items showing intentional liquid damage/accidental physical breakage are excluded from return eligibility.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Can I exchange for a different color or model?</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Yes! When submitting an exchange request, you can select any active catalog item. Any price difference will be credited or invoiced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};