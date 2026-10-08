import React from 'react';
import { Wifi, Battery, Signal, Compass, Home, Search, ShoppingBag, User } from 'lucide-react';
import { ScreenId } from '../types';

interface DeviceFrameProps {
  currentScreen: ScreenId;
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  currentScreen,
  cartCount,
  onNavigate,
  children,
}) => {
  return (
    <div className="relative mx-auto my-auto flex flex-col items-center">
      {/* Device Bezel & Outer Shell */}
      <div className="relative w-[385px] h-[812px] bg-stone-900 rounded-[52px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/80">
        {/* Exterior Hardware Buttons */}
        <div className="absolute -left-[13px] top-[115px] w-[3px] h-[26px] bg-stone-700 rounded-l-sm" />
        <div className="absolute -left-[13px] top-[160px] w-[3px] h-[48px] bg-stone-700 rounded-l-sm" />
        <div className="absolute -left-[13px] top-[220px] w-[3px] h-[48px] bg-stone-700 rounded-l-sm" />
        <div className="absolute -right-[13px] top-[170px] w-[3px] h-[70px] bg-stone-700 rounded-r-sm" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full bg-[#FBF9F5] rounded-[42px] overflow-hidden flex flex-col shadow-inner">
          {/* Top Status Bar & Dynamic Island */}
          <div className="absolute top-0 left-0 right-0 z-40 px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold pointer-events-none select-none">
            {/* Clock */}
            <span className="text-[12px] tracking-tight font-medium text-stone-900 drop-shadow-xs">
              9:41
            </span>

            {/* Dynamic Island Pill */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[116px] h-[28px] bg-black rounded-full flex items-center justify-between px-2.5 pointer-events-auto shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900/90 border border-stone-800" />
              <div className="flex items-center gap-1.5 text-[10px] text-amber-200/90 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] tracking-widest uppercase">Atelier</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />
            </div>

            {/* Right Status Icons */}
            <div className="flex items-center gap-1.5 text-stone-900">
              <Signal className="w-3 h-3 stroke-[2.5]" />
              <Wifi className="w-3 h-3 stroke-[2.5]" />
              <Battery className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="relative flex-1 overflow-hidden w-full h-full">
            {children}
          </div>

          {/* Bottom Native Navigation Dock (Visible on app screens except onboarding) */}
          {currentScreen !== 'onboarding' && (
            <nav className="absolute bottom-0 left-0 right-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-t border-stone-200/70 px-6 pt-2 pb-6 flex items-center justify-between">
              <button
                onClick={() => onNavigate('home')}
                className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
                  currentScreen === 'home' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">Archive</span>
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
                  currentScreen === 'explore' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Search className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">Catalog</span>
              </button>

              <button
                onClick={() => onNavigate('checkout')}
                className={`flex flex-col items-center gap-0.5 text-xs transition-colors relative ${
                  currentScreen === 'checkout' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">Acquire</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-amber-700 text-white rounded-full text-[9px] font-mono flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
                  currentScreen === 'profile' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">Curator</span>
              </button>
            </nav>
          )}

          {/* iOS Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-900/60 rounded-full z-40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
