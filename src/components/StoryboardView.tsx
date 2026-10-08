import React, { useState } from 'react';
import { ScreenId, Product, Story, UserProfile, CartItem, CurrencyCode, OrderRecord } from '../types';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { DetailScreen } from './screens/DetailScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, ExternalLink } from 'lucide-react';

interface StoryboardViewProps {
  products: Product[];
  stories: Story[];
  user: UserProfile;
  cart: CartItem[];
  savedItemIds: string[];
  heroImage: string;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  onFocusScreen: (screen: ScreenId) => void;
  onSelectProduct: (product: Product) => void;
  onToggleSave: (productId: string) => void;
  onOpenStory: (story: Story) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, finishId?: string, quantity?: number) => void;
  onUpdateQuantity: (productId: string, finishId: string, delta: number) => void;
  onRemoveItem: (productId: string, finishId: string) => void;
  onClearCart: () => void;
  onOpenHotlinkModal: () => void;
  onOpenRoomVisualizer: (product: Product) => void;
  onOpenSampleModal: (product: Product) => void;
  onViewCertificate: (order: OrderRecord) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  products,
  stories,
  user,
  cart,
  savedItemIds,
  heroImage,
  currency,
  onSelectCurrency,
  onFocusScreen,
  onSelectProduct,
  onToggleSave,
  onOpenStory,
  onQuickView,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenHotlinkModal,
  onOpenRoomVisualizer,
  onOpenSampleModal,
  onViewCertificate,
}) => {
  const [scale, setScale] = useState<number>(0.85);

  const screensConfig: {
    id: ScreenId;
    title: string;
    number: string;
    description: string;
    component: React.ReactNode;
  }[] = [
    {
      id: 'onboarding',
      number: '01',
      title: 'Welcome & Editorial Onboarding',
      description: 'Tactile hero banner, provenance pledge, edition manifest.',
      component: (
        <OnboardingScreen
          onNavigate={(s) => onFocusScreen(s)}
          heroImage={heroImage}
        />
      ),
    },
    {
      id: 'home',
      number: '02',
      title: 'Curated Archive Feed',
      description: 'Studio journals, curator pick spotlight, daily essays.',
      component: (
        <HomeScreen
          products={products}
          stories={stories}
          savedItemIds={savedItemIds}
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          currency={currency}
          onNavigate={(s) => onFocusScreen(s)}
          onSelectProduct={(p) => {
            onSelectProduct(p);
            onFocusScreen('detail');
          }}
          onToggleSave={onToggleSave}
          onOpenStory={onOpenStory}
          onQuickView={onQuickView}
          onAddToCart={(p) => onAddToCart(p)}
        />
      ),
    },
    {
      id: 'explore',
      number: '03',
      title: 'Explore Catalog & Search',
      description: 'Real-time search, category filters, masonry & list modes.',
      component: (
        <ExploreScreen
          products={products}
          savedItemIds={savedItemIds}
          currency={currency}
          onNavigate={(s) => onFocusScreen(s)}
          onSelectProduct={(p) => {
            onSelectProduct(p);
            onFocusScreen('detail');
          }}
          onToggleSave={onToggleSave}
          onQuickView={onQuickView}
          onAddToCart={(p) => onAddToCart(p)}
        />
      ),
    },
    {
      id: 'detail',
      number: '04',
      title: 'Piece Detail & Visual Story',
      description: 'Gallery carousel, finish swatches, architectural specs.',
      component: (
        <DetailScreen
          product={products[0]}
          savedItemIds={savedItemIds}
          currency={currency}
          onBack={() => onFocusScreen('home')}
          onNavigate={(s) => onFocusScreen(s)}
          onToggleSave={onToggleSave}
          onAddToCart={(p, f, q) => onAddToCart(p, f, q)}
          onOpenRoomVisualizer={() => onOpenRoomVisualizer(products[0])}
          onOpenSampleModal={() => onOpenSampleModal(products[0])}
        />
      ),
    },
    {
      id: 'checkout',
      number: '05',
      title: 'Acquisition Bag & Checkout',
      description: 'Privilege voucher, Apple Pay settlement, order manifest.',
      component: (
        <CheckoutScreen
          cart={
            cart.length > 0
              ? cart
              : [
                  {
                    product: products[0],
                    quantity: 1,
                    selectedFinishId: products[0].finishes[0].id,
                  },
                ]
          }
          currency={currency}
          onBack={() => onFocusScreen('home')}
          onNavigate={(s) => onFocusScreen(s)}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
        />
      ),
    },
    {
      id: 'profile',
      number: '06',
      title: 'Curator Profile & Private Vault',
      description: 'Saved archives, moodboards canvas, acquisition receipts.',
      component: (
        <ProfileScreen
          user={user}
          products={products}
          savedItemIds={savedItemIds}
          currency={currency}
          onSelectCurrency={onSelectCurrency}
          onNavigate={(s) => onFocusScreen(s)}
          onSelectProduct={(p) => {
            onSelectProduct(p);
            onFocusScreen('detail');
          }}
          onToggleSave={onToggleSave}
          onOpenHotlinkModal={onOpenHotlinkModal}
          onViewCertificate={onViewCertificate}
        />
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#121318] text-stone-100 overflow-hidden select-none">
      {/* Top Storyboard Utility Controls */}
      <div className="bg-[#181a22] border-b border-stone-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-serif text-sm font-bold tracking-wide text-white">
              Storyboard Studio Canvas
            </h2>
          </div>
          <span className="text-stone-500 font-mono text-xs">·</span>
          <span className="text-xs text-stone-400 font-mono">
            All 6 App Screens at 1:1 Scale
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Slider Controls */}
          <div className="flex items-center gap-2 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setScale(Math.max(0.6, scale - 0.1))}
              className="text-stone-400 hover:text-white p-0.5"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono w-10 text-center text-stone-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(1.2, scale + 0.1))}
              className="text-stone-400 hover:text-white p-0.5"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenHotlinkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hotlink Images</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-8 bg-[#0c0d12]">
        <div
          className="flex flex-wrap items-start justify-center gap-10 transition-transform origin-top duration-200"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          {screensConfig.map((screen) => (
            <div
              key={screen.id}
              className="flex flex-col items-center group"
            >
              {/* Screen Header Badge */}
              <div className="w-[375px] flex items-center justify-between pb-2.5 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {screen.number}
                  </span>
                  <span className="font-serif text-sm font-semibold text-white">
                    {screen.title}
                  </span>
                </div>

                <button
                  onClick={() => onFocusScreen(screen.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-amber-300 transition-colors bg-stone-900/60 hover:bg-stone-900 px-2 py-0.5 rounded border border-stone-800"
                >
                  <span>Interactive</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Realistic Screen Bezel */}
              <div className="relative w-[375px] h-[780px] bg-[#FBF9F5] rounded-[36px] overflow-hidden shadow-2xl border-4 border-stone-800 ring-1 ring-stone-700/50">
                {screen.component}

                {/* Hover Focus Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button
                    onClick={() => onFocusScreen(screen.id)}
                    className="pointer-events-auto px-4 py-2 bg-white text-stone-900 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Open in Device Mode</span>
                  </button>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-stone-500 text-center max-w-[340px]">
                {screen.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
