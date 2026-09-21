import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Headphones, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Background Subtle Gradient & Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-accent-400 mb-6 backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Fall/Winter 2026 Collection Dropping Now</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
              Tactile Precision. <br />
              <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Everyday Modern Gear.
              </span>
            </h1>

            {/* Sub-copy */}
            <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              NOVA engineers minimalist gear at the intersection of Scandinavian ergonomics,
              aerospace-grade aluminum, and tactile acoustic craftsmanship.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-xl shadow-white/5 font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Catalog
                </Button>
              </Link>

              <Link to="/products?category=audio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800 hover:text-white backdrop-blur-md"
                  leftIcon={<Headphones className="w-4 h-4 text-accent-400" />}
                >
                  Acoustic Series
                </Button>
              </Link>
            </div>

            {/* Micro Feature Proof Points */}
            <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <div className="font-display font-bold text-2xl text-white">30-Day</div>
                <div className="text-xs text-zinc-400 mt-0.5">Risk-free trial</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-white">₹2,999+</div>
                <div className="text-xs text-zinc-400 mt-0.5">Free Express ship</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-white">100%</div>
                <div className="text-xs text-zinc-400 mt-0.5">Tactile warranty</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glow backdrop behind card */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-accent-600/30 to-purple-600/30 blur-2xl opacity-50" />

              {/* Spotlight Product Display Card */}
              <div className="relative rounded-3xl bg-zinc-900/80 border border-zinc-800/80 p-5 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop"
                    alt="NOVA Pulse Wireless Headphones"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[11px] font-bold text-accent-400 uppercase tracking-wider">
                    Editor's Choice
                  </div>
                  <div className="absolute bottom-3 right-3 bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-bold text-white flex items-center gap-1.5">
                    <span>₹8,499</span>
                    <span className="text-[10px] text-zinc-400 line-through font-normal">₹11,999</span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-accent-400">
                      Signature Acoustic Series
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mt-0.5">
                      NOVA Pulse Wireless Headphones
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      Custom 40mm titanium drivers, active hybrid noise cancellation & plush memory foam.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock • Ready to Dispatch
                  </span>

                  <Link
                    to="/products/nova-pulse-wireless-headphones"
                    className="text-xs font-bold text-white hover:text-accent-400 flex items-center gap-1 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
