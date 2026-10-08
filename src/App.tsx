/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ScreenId, Product, Story, CartItem, UserProfile, CurrencyCode, OrderRecord } from './types';
import { INITIAL_PRODUCTS, STORIES, INITIAL_USER } from './data/mockData';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';
import { StoryboardView } from './components/StoryboardView';
import { StoryViewerModal } from './components/StoryViewerModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ImageHotlinkModal } from './components/ImageHotlinkModal';
import { RoomScaleVisualizerModal } from './components/RoomScaleVisualizerModal';
import { MaterialSampleModal } from './components/MaterialSampleModal';
import { CertificateModal } from './components/CertificateModal';

import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { DetailScreen } from './components/screens/DetailScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [viewMode, setViewMode] = useState<'device' | 'storyboard' | 'desktop'>('device');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [savedItemIds, setSavedItemIds] = useState<string[]>(['prod-1', 'prod-2', 'prod-3']);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      selectedFinishId: INITIAL_PRODUCTS[0].finishes[0].id,
    },
  ]);
  const [user] = useState<UserProfile>(INITIAL_USER);
  const [heroImage, setHeroImage] = useState<string>(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  );
  const [isHotlinkModalOpen, setIsHotlinkModalOpen] = useState(false);
  const [isRoomVisualizerOpen, setIsRoomVisualizerOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [activeCertificateOrder, setActiveCertificateOrder] = useState<OrderRecord | null>(null);

  // Cart operations
  const handleAddToCart = (product: Product, finishId?: string, quantity: number = 1) => {
    const targetFinish = finishId || product.finishes[0]?.id || 'default';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedFinishId === targetFinish
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedFinishId === targetFinish
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedFinishId: targetFinish }];
    });
  };

  const handleUpdateQuantity = (productId: string, finishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedFinishId === finishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string, finishId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedFinishId === finishId)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Saved / Wishlist toggle
  const handleToggleSave = (productId: string) => {
    setSavedItemIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Hotlink image updates
  const handleApplyHotlinks = (imageUrls: string[]) => {
    if (imageUrls.length === 0) return;

    if (imageUrls[0]) {
      setHeroImage(imageUrls[0]);
    }

    setProducts((prev) =>
      prev.map((prod, idx) => {
        const replacementUrl = imageUrls[idx % imageUrls.length];
        return {
          ...prod,
          images: [replacementUrl, ...prod.images.slice(1)],
          finishes: prod.finishes.map((f, fIdx) => ({
            ...f,
            image: imageUrls[(idx + fIdx) % imageUrls.length] || f.image,
          })),
        };
      })
    );

    setStories((prev) =>
      prev.map((st, idx) => ({
        ...st,
        coverImage: imageUrls[(idx + 1) % imageUrls.length] || st.coverImage,
        slides: st.slides.map((sl, sIdx) => ({
          ...sl,
          image: imageUrls[(idx + sIdx) % imageUrls.length] || sl.image,
        })),
      }))
    );
  };

  const handleResetDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSelectedProduct(INITIAL_PRODUCTS[0]);
    setStories(STORIES);
    setHeroImage(
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    );
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Render current screen component
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            heroImage={heroImage}
          />
        );
      case 'home':
        return (
          <HomeScreen
            products={products}
            stories={stories}
            savedItemIds={savedItemIds}
            cartCount={totalCartCount}
            currency={currency}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('detail');
            }}
            onToggleSave={handleToggleSave}
            onOpenStory={(story) => setActiveStory(story)}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={(product) => handleAddToCart(product)}
          />
        );
      case 'explore':
        return (
          <ExploreScreen
            products={products}
            savedItemIds={savedItemIds}
            currency={currency}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('detail');
            }}
            onToggleSave={handleToggleSave}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={(product) => handleAddToCart(product)}
          />
        );
      case 'detail':
        return (
          <DetailScreen
            product={selectedProduct}
            savedItemIds={savedItemIds}
            currency={currency}
            onBack={() => setCurrentScreen('home')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onToggleSave={handleToggleSave}
            onAddToCart={(prod, finishId, qty) => handleAddToCart(prod, finishId, qty)}
            onOpenRoomVisualizer={() => setIsRoomVisualizerOpen(true)}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            cart={cart}
            currency={currency}
            onBack={() => setCurrentScreen('home')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            products={products}
            savedItemIds={savedItemIds}
            currency={currency}
            onSelectCurrency={setCurrency}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('detail');
            }}
            onToggleSave={handleToggleSave}
            onOpenHotlinkModal={() => setIsHotlinkModalOpen(true)}
            onViewCertificate={(order) => setActiveCertificateOrder(order)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] overflow-hidden select-none">
      {/* Studio Header Bar */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentScreen={currentScreen}
        onSelectScreen={(s) => setCurrentScreen(s)}
        cartCount={totalCartCount}
        currency={currency}
        onSelectCurrency={setCurrency}
        onOpenHotlinkModal={() => setIsHotlinkModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {viewMode === 'storyboard' ? (
          <StoryboardView
            products={products}
            stories={stories}
            user={user}
            cart={cart}
            savedItemIds={savedItemIds}
            heroImage={heroImage}
            currency={currency}
            onSelectCurrency={setCurrency}
            onFocusScreen={(screen) => {
              setCurrentScreen(screen);
              setViewMode('device');
            }}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onToggleSave={handleToggleSave}
            onOpenStory={(st) => setActiveStory(st)}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToCart={(prod, finishId, qty) => handleAddToCart(prod, finishId, qty)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onOpenHotlinkModal={() => setIsHotlinkModalOpen(true)}
            onOpenRoomVisualizer={(prod) => {
              setSelectedProduct(prod);
              setIsRoomVisualizerOpen(true);
            }}
            onOpenSampleModal={(prod) => {
              setSelectedProduct(prod);
              setIsSampleModalOpen(true);
            }}
            onViewCertificate={(order) => setActiveCertificateOrder(order)}
          />
        ) : viewMode === 'device' ? (
          <div className="w-full h-full flex items-center justify-center p-4 overflow-y-auto">
            <DeviceFrame
              currentScreen={currentScreen}
              cartCount={totalCartCount}
              onNavigate={(s) => setCurrentScreen(s)}
            >
              {renderScreen()}
            </DeviceFrame>
          </div>
        ) : (
          /* Desktop / Fluid Adaptive Preview */
          <div className="w-full h-full flex items-center justify-center p-6 overflow-y-auto bg-stone-900/60">
            <div className="w-full max-w-md h-[840px] bg-[#FBF9F5] rounded-3xl overflow-hidden shadow-2xl border border-stone-700/80 relative flex flex-col">
              {renderScreen()}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <StoryViewerModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      <QuickViewModal
        product={quickViewProduct}
        savedItemIds={savedItemIds}
        currency={currency}
        onClose={() => setQuickViewProduct(null)}
        onSelectProduct={(prod) => {
          setSelectedProduct(prod);
          setCurrentScreen('detail');
        }}
        onAddToCart={(prod) => handleAddToCart(prod)}
        onToggleSave={handleToggleSave}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      <ImageHotlinkModal
        isOpen={isHotlinkModalOpen}
        onClose={() => setIsHotlinkModalOpen(false)}
        onApplyHotlinks={handleApplyHotlinks}
        onResetDefaults={handleResetDefaults}
        currentHeroImage={heroImage}
      />

      <RoomScaleVisualizerModal
        product={selectedProduct}
        isOpen={isRoomVisualizerOpen}
        onClose={() => setIsRoomVisualizerOpen(false)}
        onAddToCart={(prod) => handleAddToCart(prod)}
      />

      <MaterialSampleModal
        product={selectedProduct}
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />

      <CertificateModal
        order={activeCertificateOrder}
        isOpen={Boolean(activeCertificateOrder)}
        onClose={() => setActiveCertificateOrder(null)}
      />
    </div>
  );
}
