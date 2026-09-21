import React from 'react';
import { Shield, Lock, Eye, Database, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
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
            <span className="text-zinc-900 dark:text-white font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Last Updated: September 2026. At NOVA, privacy is an architectural principle, not an afterthought.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <Shield className="w-5 h-5 text-accent-500" />
              <h2>1. Information We Collect</h2>
            </div>
            <p>
              When you visit or make a purchase from NOVA Modern Essentials, we collect device telemetry (browser type, IP address, time zone) and transaction details (customer name, shipping address, contact email, phone number) necessary to fulfill your orders and render high-performance UI states.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <Lock className="w-5 h-5 text-accent-500" />
              <h2>2. Payment & Cryptographic Security</h2>
            </div>
            <p>
              NOVA does not store raw credit card numbers or banking passwords on our servers. All financial payment transactions are tokenized and processed through 256-bit encrypted Level 1 PCI-DSS compliant gateways. Admin sessions utilize HMAC-signed JSON Web Tokens (JWT) with bcrypt salt hashing.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <Eye className="w-5 h-5 text-accent-500" />
              <h2>3. How We Use Your Data</h2>
            </div>
            <p>
              We use collected information solely to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pl-2">
              <li>Process and fulfill orders, shipments, and warranty claim tracking.</li>
              <li>Communicate dispatch tracking updates and customer service responses.</li>
              <li>Send our curated NOVA Journal editorial newsletter (only with explicit opt-in).</li>
              <li>Detect and prevent fraudulent transactions and unauthorized API abuse.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <Database className="w-5 h-5 text-accent-500" />
              <h2>4. Third-Party Data Sharing</h2>
            </div>
            <p>
              We do not sell, rent, or monetize your personal information to third-party data brokers. We share data only with verified logistical infrastructure partners (express delivery couriers, cloud database hosting) strictly for fulfillment operations.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-bold text-base mb-3">
              <FileCheck className="w-5 h-5 text-accent-500" />
              <h2>5. Your Rights & Data Deletion</h2>
            </div>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or ask for complete deletion of your customer record and newsletter subscriptions by contacting our privacy compliance desk.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};