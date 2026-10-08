import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Check,
  Shield,
  Truck,
  Compass,
  Eye,
  Package,
  Lightbulb,
  Sun,
  Flame,
  Zap,
} from 'lucide-react';
import { Product, ScreenId, CurrencyCode } from '../../types';
import { formatPrice } from '../../data/mockData';
import { AudioJournalPlayer } from '../AudioJournalPlayer';

interface DetailScreenProps {
  product: Product;
  savedItemIds: string[];
  currency?: CurrencyCode;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onToggleSave: (productId: string) => void;
  onAddToCart: (product: Product, finishId: string, quantity: number) => void;
  onOpenRoomVisualizer?: () => void;
  onOpenSampleModal?: () => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({
  product,
  savedItemIds,
  currency = 'USD',
  onBack,
  onNavigate,
  onToggleSave,
  onAddToCart,
  onOpenRoomVisualizer,
  onOpenSampleModal,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [ambientSimMode, setAmbientSimMode] = useState<'daylight' | 'golden' | 'candlelight'>('golden');

  const activeFinish = product.finishes.find((f) => f.id === selectedFinish) || product.finishes[0];
  const isLighting = product.category === 'Lighting';

  const handleAddToCartClick = () => {
    onAddToCart(product, activeFinish.id, quantity);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 2200);
  };

  return (
    <div className="h-full flex flex-col bg-[#FBF9F5] text-stone-900 overflow-y-auto no-scrollbar pb-28 select-none relative">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md px-5 pt-11 pb-3 flex items-center justify-between border-b border-stone-200/60">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="font-serif text-sm tracking-wide font-medium text-stone-800 truncate max-w-[180px]">
          {product.title}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleSave(product.id)}
            aria-label="Save"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                savedItemIds.includes(product.id) ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, text: product.description, url: window.location.href });
              }
            }}
            aria-label="Share"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={activeFinish?.image || product.images[selectedImageIdx]}
          alt={product.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLighting && ambientSimMode === 'candlelight'
              ? 'filter sepia-[0.35] contrast-105 brightness-95'
              : isLighting && ambientSimMode === 'golden'
              ? 'filter sepia-[0.15] contrast-102'
              : ''
          }`}
        />

        {/* Ambient simulation tint overlay for lighting pieces */}
        {isLighting && (
          <div
            className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
              ambientSimMode === 'candlelight'
                ? 'bg-amber-950/20 mix-blend-color-burn'
                : ambientSimMode === 'golden'
                ? 'bg-amber-500/10 mix-blend-soft-light'
                : 'bg-transparent'
            }`}
          />
        )}

        <div className="absolute bottom-3 right-3 bg-stone-950/70 backdrop-blur-md text-stone-100 text-[10px] font-mono px-2 py-0.5 rounded-full">
          0{selectedImageIdx + 1} / 0{product.images.length}
        </div>

        {/* Spatial Preview Floating Quick Badge */}
        {onOpenRoomVisualizer && (
          <button
            onClick={onOpenRoomVisualizer}
            className="absolute top-3 left-3 bg-stone-900/80 hover:bg-stone-900 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5 border border-white/20 transition-all shadow-md active:scale-95"
          >
            <Eye className="w-3 h-3 text-amber-300" />
            <span>Room Scale AR Preview</span>
          </button>
        )}
      </div>

      {/* Lighting Ambient Simulation Control (when product is Lighting) */}
      {isLighting && (
        <div className="px-5 pt-3">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-950 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-serif">Atmosphere Simulation:</span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { id: 'daylight', label: '5000K Day', icon: Sun },
                { id: 'golden', label: '2700K Warm', icon: Lightbulb },
                { id: 'candlelight', label: '2100K Dusk', icon: Flame },
              ].map((sim) => {
                const Icon = sim.icon;
                return (
                  <button
                    key={sim.id}
                    onClick={() => setAmbientSimMode(sim.id as any)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-medium flex items-center gap-1 transition-all ${
                      ambientSimMode === sim.id
                        ? 'bg-amber-900 text-white shadow-2xs'
                        : 'bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-200/80'
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{sim.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Thumbnails */}
      <div className="px-5 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImageIdx(idx)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
              selectedImageIdx === idx ? 'border-stone-900 scale-95' : 'border-stone-200 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Product Information */}
      <div className="px-5 pt-4 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
              {product.designer}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-stone-900">{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            {product.title}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">{product.subtitle}</p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-sans text-stone-900">
              {formatPrice(product.price, currency)}
            </span>
            <span className="text-xs text-stone-500 font-mono">({currency} · Tax & Duties Included)</span>
          </div>
        </div>

        {/* Architectural Interactive Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {onOpenRoomVisualizer && (
            <button
              onClick={onOpenRoomVisualizer}
              className="py-2.5 px-3 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Room Visualizer</span>
            </button>
          )}

          {onOpenSampleModal && (
            <button
              onClick={onOpenSampleModal}
              className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 bg-white text-stone-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-stone-700" />
              <span>Request Swatches</span>
            </button>
          )}
        </div>

        {/* Finish / Material Variant Swatches */}
        {product.finishes && product.finishes.length > 0 && (
          <div className="pt-2 border-t border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-800">Finish Specification:</span>
              <span className="text-xs text-stone-600 font-medium">{activeFinish?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {product.finishes.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => setSelectedFinish(finish.id)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-lg border text-xs transition-all ${
                    selectedFinish === finish.id
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: finish.colorHex }}
                  />
                  <span className="truncate max-w-[100px]">{finish.name.split('/')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Audio Journal Commentary on Piece */}
        <AudioJournalPlayer
          title={`Crafting the ${product.title}`}
          speaker={product.designer}
          durationSeconds={95}
          transcript={`Our intention with ${product.title} was to eliminate superfluous ornament and celebrate the tension between hand-hewn textures and architectural silhouettes.`}
        />

        {/* Description */}
        <div className="pt-2 border-t border-stone-200/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono mb-1.5">
            Architectural Narrative
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Lighting Technical Engineering Data */}
        {product.lightingSpecs && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-serif font-bold text-amber-950 pb-1 border-b border-amber-200/60">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Optical & Engineering Specifications</span>
            </div>
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/40">
              <span className="text-stone-600 font-medium">Color Temperature</span>
              <span className="font-mono text-amber-900 font-semibold">{product.lightingSpecs.colorTemperature}</span>
            </div>
            {product.lightingSpecs.lumens && (
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/40">
                <span className="text-stone-600 font-medium">Luminous Output</span>
                <span className="font-mono text-stone-800">{product.lightingSpecs.lumens} Lumens</span>
              </div>
            )}
            {product.lightingSpecs.powerSource && (
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/40">
                <span className="text-stone-600 font-medium">Power & Controls</span>
                <span className="font-mono text-stone-800">{product.lightingSpecs.powerSource}</span>
              </div>
            )}
            {product.lightingSpecs.cri && (
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Color Rendering Index</span>
                <span className="font-mono text-stone-800">{product.lightingSpecs.cri}</span>
              </div>
            )}
          </div>
        )}

        {/* Specifications Accordion / Grid */}
        <div className="bg-stone-100/80 rounded-xl p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
            <span className="text-stone-500 font-medium">Dimensions</span>
            <span className="font-mono text-stone-800">{product.dimensions}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
            <span className="text-stone-500 font-medium">Primary Materials</span>
            <span className="text-stone-800 text-right">{product.materials.join(' · ')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Availability</span>
            <span className="font-mono text-amber-800 font-semibold">{product.leadTime}</span>
          </div>
        </div>

        {/* Atelier Guarantee Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-stone-600 pt-2">
          <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-stone-800" />
            <span>White Glove Delivery</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex flex-col items-center gap-1">
            <Shield className="w-4 h-4 text-stone-800" />
            <span>10-Yr Guarantee</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex flex-col items-center gap-1">
            <Compass className="w-4 h-4 text-stone-800" />
            <span>Ethical Provenance</span>
          </div>
        </div>
      </div>

      {/* Floating Add Toast Notification */}
      {isAddedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added to your curated bag</span>
          <button
            onClick={() => onNavigate('checkout')}
            className="text-amber-300 underline font-semibold ml-1"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Sticky Bottom Action Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-t border-stone-200 px-5 py-3.5 flex items-center gap-3">
        {/* Quantity Stepper */}
        <div className="flex items-center bg-stone-200/80 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 flex items-center justify-center font-mono font-bold text-stone-700 hover:text-stone-900"
          >
            -
          </button>
          <span className="w-6 text-center font-mono text-xs font-bold text-stone-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 flex items-center justify-center font-mono font-bold text-stone-700 hover:text-stone-900"
          >
            +
          </button>
        </div>

        {/* Add to Bag CTA */}
        <button
          onClick={handleAddToCartClick}
          className="flex-1 py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wide flex items-center justify-between shadow-md active:scale-[0.99] transition-transform"
        >
          <span>Acquire Piece</span>
          <span className="font-mono font-bold text-amber-200">
            {formatPrice(product.price * quantity, currency)}
          </span>
        </button>
      </div>
    </div>
  );
};

