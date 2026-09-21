import React, { useState } from 'react';
import { Award, ShieldCheck, Wrench, CheckCircle2, FileText, Send, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export const WarrantyPage: React.FC = () => {
  const [sku, setSku] = useState('');
  const [orderId, setOrderId] = useState('');
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Warranty claim submitted. Our engineering diagnostic team will review within 24 hours.', 'Claim Received');
  };

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
            <span className="text-zinc-900 dark:text-white font-medium">Warranty & Guarantee</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
            Comprehensive Lifetime Guarantee
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Every NOVA hardware product is built with aerospace-grade anodized aluminum, Japanese internal mechanisms, and reinforced structural components.
          </p>
        </div>

        {/* Coverage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-500 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Manufacturing Defects</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              100% replacement coverage for material degradation, acoustic driver imbalance, and internal circuit anomalies.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-500 flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Repairs & Diagnostics</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Access to genuine modular replacement parts (earpads, cable cords, titanium hardware links) for the entire product lifecycle.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-500 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Certified Genuine</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              All direct purchases through NOVA or authorized studio retail partners are automatically registered in our database.
            </p>
          </div>
        </div>

        {/* Warranty Claim Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-white mb-2">
            Submit a Warranty Claim
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
            Have an issue with your hardware? Provide your order details and our engineering team will assist with replacement or diagnostic service.
          </p>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Claim Registered Successfully
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 max-w-md mx-auto">
                Your claim ID is <span className="font-mono font-bold">CLM-{Math.floor(100000 + Math.random() * 900000)}</span>. A diagnostic specialist will follow up with troubleshooting steps or courier pickup instructions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Order ID <span className="text-accent-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NOV-8492"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-accent-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Product SKU or Model Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NOV-AUD-001 or Pulse ANC"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-accent-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Issue Description & Symptoms <span className="text-accent-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe the behavior or malfunction you are experiencing..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-accent-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!orderId.trim() || !issue.trim()}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Claim</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};