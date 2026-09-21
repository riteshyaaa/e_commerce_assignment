import React from 'react';
import { Shield, Sparkles, Cpu, RefreshCw, Feather, Layers } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Aerospace-Grade Materials',
      description:
        'CNC-milled 6000-series aluminum, ballistic 1680D Cordura, and custom beryllium drivers engineered for lifelong resilience.',
    },
    {
      icon: Feather,
      title: 'Scandinavian Ergonomics',
      description:
        'Every bevel, tactile knurl, and stitch is calculated for effortless daily carry and seamless tactile feedback in modern routines.',
    },
    {
      icon: RefreshCw,
      title: 'Circular Lifecycle & Care',
      description:
        'Modular magnetic components and repairable assemblies designed to minimize electronics waste and maximize product longevity.',
    },
    {
      icon: Shield,
      title: '30-Day Testing Window',
      description:
        'Test our gear in your actual daily commute. If it does not elevate your workflow, return it hassle-free with doorstep pickup.',
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 text-accent-700 text-xs font-bold uppercase tracking-wider mb-4 border border-accent-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The NOVA Philosophy</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-900 tracking-tight">
          Engineered for Longevity. <br />
          Crafted for the Discerning.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed">
          We reject disposable consumerism in favor of timeless design, honest raw materials,
          and meticulous acoustic and structural engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar, idx) => (
          <div
            key={pillar.title}
            className="relative p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-accent-600 transition-all duration-300">
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-zinc-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{pillar.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              0{idx + 1} // NOVA Standard
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
