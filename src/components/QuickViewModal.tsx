import React from 'react';
import { X, Star, ArrowRight, Heart, Lightbulb } from 'lucide-react';
import { Product, ScreenId, CurrencyCode } from '../types';
import { formatPrice } from '../data/mockData';

interface QuickViewModalProps {
  product: Product | null;
  savedItemIds: string[];
  currency?: CurrencyCode;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleSave: (productId: string) => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  savedItemIds,
  currency = 'USD',
  onClose,
  onSelectProduct,
  onAddToCart,
  onToggleSave,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl space-y-3 relative border border-stone-200">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-stone-900 shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <span className="text-[10px] bg-stone-900/80 backdrop-blur-sm text-stone-100 px-2 py-0.5 rounded font-mono">
              {product.category}
            </span>
            {product.lightingSpecs && (
              <span className="text-[10px] bg-amber-900/80 backdrop-blur-sm text-amber-100 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <Lightbulb className="w-2.5 h-2.5" />
                {product.lightingSpecs.colorTemperature.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 pt-1 space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                {product.designer}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-stone-400 font-mono text-[10px]">({product.reviewsCount})</span>
              </div>
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mt-0.5">
              {product.title}
            </h3>
            <p className="text-xs text-stone-500">{product.subtitle}</p>
          </div>

          <div className="text-xs text-stone-600 line-clamp-2">
            {product.description}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-bold text-stone-900 font-sans">
              {formatPrice(product.price, currency)}
            </span>
            <button
              onClick={() => onToggleSave(product.id)}
              aria-label="Save"
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  savedItemIds.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onSelectProduct(product);
              }}
              className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-medium flex items-center justify-center gap-1"
            >
              <span>Full Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-xs"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
