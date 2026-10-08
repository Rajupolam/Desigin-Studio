import React from 'react';
import { ScreenId, CurrencyCode } from '../types';
import { Smartphone, LayoutGrid, Monitor, Sparkles, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  viewMode: 'device' | 'storyboard' | 'desktop';
  setViewMode: (mode: 'device' | 'storyboard' | 'desktop') => void;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  cartCount: number;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  onOpenHotlinkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  currentScreen,
  onSelectScreen,
  cartCount,
  currency,
  onSelectCurrency,
  onOpenHotlinkModal,
}) => {
  const screens: { id: ScreenId; label: string; number: string }[] = [
    { id: 'onboarding', label: 'Onboard', number: '01' },
    { id: 'home', label: 'Archive', number: '02' },
    { id: 'explore', label: 'Catalog', number: '03' },
    { id: 'detail', label: 'Detail', number: '04' },
    { id: 'checkout', label: 'Acquire', number: '05' },
    { id: 'profile', label: 'Vault', number: '06' },
  ];

  return (
    <header className="bg-[#14151b] border-b border-stone-800/90 text-stone-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-40 select-none">
      {/* Brand & Studio Edition */}
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-lg font-bold tracking-wider text-stone-100">
            ATELIER
          </span>
          <span className="text-[10px] tracking-widest text-amber-300 font-mono uppercase">
            Design Studio
          </span>
        </div>
        <span className="text-stone-700 hidden sm:inline">|</span>
        <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
          Edition 2026 · 6 High-Fidelity Screens
        </span>
      </div>

      {/* Screen Quick-Jump Segmented Control */}
      <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800">
        {screens.map((scr) => (
          <button
            key={scr.id}
            onClick={() => {
              onSelectScreen(scr.id);
              if (viewMode === 'storyboard') {
                setViewMode('device');
              }
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
              currentScreen === scr.id && viewMode !== 'storyboard'
                ? 'bg-amber-950 text-amber-200 border border-amber-700/50 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span className="opacity-60 text-[10px]">{scr.number}</span>
            <span className="font-sans font-medium">{scr.label}</span>
          </button>
        ))}
      </div>

      {/* Viewport Modes, Currency & Hotlink Button */}
      <div className="flex items-center gap-2">
        {/* Currency Switcher */}
        <div className="flex items-center bg-stone-900/90 p-0.5 rounded-lg border border-stone-800 text-[11px] font-mono">
          {(['USD', 'EUR', 'GBP', 'JPY'] as CurrencyCode[]).map((c) => (
            <button
              key={c}
              onClick={() => onSelectCurrency(c)}
              className={`px-2 py-1 rounded-md transition-colors ${
                currency === c
                  ? 'bg-stone-800 text-amber-300 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Device vs Storyboard vs Responsive Toggle */}
        <div className="flex items-center bg-stone-900/90 p-0.5 rounded-lg border border-stone-800">
          <button
            onClick={() => setViewMode('device')}
            title="Mobile Device Simulator"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'device'
                ? 'bg-stone-800 text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode('storyboard')}
            title="Storyboard Canvas (All 6 Screens)"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'storyboard'
                ? 'bg-stone-800 text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode('desktop')}
            title="Full-Width Adaptive View"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'desktop'
                ? 'bg-stone-800 text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* Hotlink HTML Extractor Action Button */}
        <button
          onClick={onOpenHotlinkModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold shadow-md active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
          <span>Hotlink Images</span>
        </button>

        {/* Bag Shortcut */}
        <button
          onClick={() => {
            onSelectScreen('checkout');
            if (viewMode === 'storyboard') setViewMode('device');
          }}
          className="relative p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
          title="Acquisition Bag"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold font-mono">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
