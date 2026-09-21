import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

export const PromoBanner: React.FC = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-zinc-950 text-white overflow-hidden p-8 sm:p-12 lg:p-16 border border-zinc-800 shadow-2xl">
        {/* Ambient lighting effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-accent-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Tag className="w-3.5 h-3.5" />
              <span>Complimentary Courier Upgrade</span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Curate Your Minimalist Workspace & Routine.
            </h3>

            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
              Order any watch, audio transducer, or commuter backpack and receive complimentary express delivery across India plus a 3-year extended structural warranty.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-xl shadow-white/10"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Shop the Collection
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-600/20 text-accent-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Curated Engineering</div>
                <div className="text-[11px] text-zinc-400">Strictly 30 signature essentials</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Full 2-Year Warranty</div>
                <div className="text-[11px] text-zinc-400">Doorstep replacement service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
