import React, { useState } from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { ScreenId } from '../../types';

interface OnboardingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  heroImage: string;
}

const SLIDES = [
  {
    kicker: 'EDITION NO. 04',
    title: 'Objects of Rare Tactility',
    desc: 'An editorial archive of architectural furniture, monolithic lighting, and studio ceramics from master artisans.',
    badge: 'Curated Autumn Collection',
  },
  {
    kicker: 'PROVENANCE & CRAFT',
    title: 'Direct From Independent Studios',
    desc: 'Every piece is commissioned directly with independent design ateliers across Kyoto, Copenhagen, Milan, and Stockholm.',
    badge: '100% Verified Provenance',
  },
  {
    kicker: 'LIVING HARMONY',
    title: 'Spaces Grounded in Materiality',
    desc: 'Unapologetic raw stone, smoked woods, and textured bouclé weaves crafted to endure generations.',
    badge: 'Architectural Philosophy',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNavigate, heroImage }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="relative h-full flex flex-col justify-between bg-stone-950 text-white overflow-hidden select-none">
      {/* Background Hero Image with Film Grain & Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Atelier living space"
          className="w-full h-full object-cover transition-all duration-700 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/30" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 pt-12 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif tracking-widest text-lg font-bold text-stone-100">ATELIER</span>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans border-l border-stone-600 pl-2">
            Studio Archive
          </span>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="text-xs tracking-wider uppercase text-stone-300 hover:text-white transition-colors py-1 px-2.5 rounded-full bg-stone-900/40 backdrop-blur-md border border-stone-700/50"
        >
          Skip
        </button>
      </div>

      {/* Middle Floating Focal Highlight */}
      <div className="relative z-10 px-6 py-4 my-auto">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-200/90 mb-3 bg-amber-950/40 backdrop-blur-md border border-amber-500/20 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{SLIDES[activeSlide].badge}</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
          {SLIDES[activeSlide].kicker}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight font-medium text-stone-50 tracking-tight">
          {SLIDES[activeSlide].title}
        </h1>
        <p className="mt-3 text-sm text-stone-300/90 leading-relaxed font-sans max-w-sm">
          {SLIDES[activeSlide].desc}
        </p>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-stone-800/80">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <Compass className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Curated Worldwide</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Lifetime Authenticity</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 p-6 pb-10 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent">
        {/* Pagination Dots */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? 'w-8 bg-amber-200' : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-stone-400 font-mono">0{activeSlide + 1} / 0{SLIDES.length}</span>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-full group flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-stone-100 hover:bg-white text-stone-900 font-medium text-sm tracking-wide transition-all shadow-lg shadow-black/40 hover:shadow-xl active:scale-[0.99]"
          >
            <span>Enter Studio Collection</span>
            <ArrowRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('explore')}
            className="w-full py-2.5 px-4 text-xs text-stone-400 hover:text-stone-200 transition-colors text-center tracking-wide"
          >
            Browse Catalog as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
