import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { success, error: toastError, info } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    try {
      setLoading(true);
      const res = await api.newsletter.subscribe(cleanEmail);
      setSubscribed(true);
      if (res.alreadySubscribed) {
        info(res.message || 'You are already subscribed to the NOVA Journal.', 'Newsletter Notice');
      } else {
        success(res.message || 'Thank you for subscribing to NOVA Journal!', 'Subscription Confirmed');
      }
      setEmail('');
    } catch (err: any) {
      toastError(err?.message || 'Failed to subscribe to the newsletter. Please try again.', 'Subscription Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-12 border-t border-zinc-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-16 border-b border-zinc-800/80">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900 text-accent-400 border border-zinc-800 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-zinc-100">Complimentary Shipping</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Free express delivery on all orders over ₹2,999 with real-time tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900 text-accent-400 border border-zinc-800 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-zinc-100">30-Day Risk-Free Returns</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Experience our gear in your routine. Seamless returns with doorstep pickup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900 text-accent-400 border border-zinc-800 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-zinc-100">Lifetime Warranty</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Engineered with aerospace-grade metals and premium ballistic textiles.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900 text-accent-400 border border-zinc-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-zinc-100">Secure Checkout</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                256-bit encrypted transactions supporting UPI, Cards, and Net Banking.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-zinc-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-display font-extrabold text-lg">
                N
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                NOVA
              </span>
            </Link>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              NOVA creates modern essentials at the intersection of Scandinavian minimalism,
              tactile craftsmanship, and progressive acoustic and everyday engineering.
            </p>

            {/* Newsletter form */}
            <div className="mt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Join the NOVA Journal
              </div>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium py-2">
                  <Check className="w-4 h-4" /> You are subscribed to product drops & editorial notes.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="bg-white text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors shrink-0 flex items-center gap-1 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 1: Shop */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Catalog</h5>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=audio" className="hover:text-white transition-colors">
                  Audio & Acoustics
                </Link>
              </li>
              <li>
                <Link to="/products?category=wearables-and-watches" className="hover:text-white transition-colors">
                  Watches & Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=bags-and-travel" className="hover:text-white transition-colors">
                  Bags & Travel
                </Link>
              </li>
              <li>
                <Link to="/products?category=footwear" className="hover:text-white transition-colors">
                  Minimalist Footwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=smart-accessories" className="hover:text-white transition-colors">
                  Smart Desk Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=lifestyle-and-everyday" className="hover:text-white transition-colors">
                  Lifestyle & Everyday
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Support */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Customer Support</h5>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors">
                  Track Your Package
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="hover:text-white transition-colors">
                  Warranty Claim
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Engineering */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Management & Legal</h5>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Admin Portal Login
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  KPI Analytics Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:5000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Swagger API Docs (/docs)
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} NOVA Modern Essentials Storefront. Built for HAXCAMP Full-Stack Assessment.
          </div>
          <div className="flex items-center gap-6">
            <span>Engineered with React, Node.js, TypeScript & PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
