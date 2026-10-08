import React, { useState } from 'react';
import { ArrowLeft, Trash2, Tag, ShieldCheck, CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { CartItem, ScreenId, CurrencyCode } from '../../types';
import { formatPrice } from '../../data/mockData';

interface CheckoutScreenProps {
  cart: CartItem[];
  currency?: CurrencyCode;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateQuantity: (productId: string, finishId: string, delta: number) => void;
  onRemoveItem: (productId: string, finishId: string) => void;
  onClearCart: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  currency = 'USD',
  onBack,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'wire'>('apple-pay');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal > 500 || cart.length === 0 ? 0 : 45;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ATELIER10') {
      setDiscountPercent(10);
      setPromoSuccess('10% Collector Privilege Applied');
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoSuccess('20% Inaugural Member Privilege Applied');
      setPromoError('');
    } else {
      setPromoError('Invalid privilege code. Try "ATELIER10"');
      setPromoSuccess('');
    }
  };

  const handlePlaceOrder = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setOrderId(`ATL-2026-${randomNum}`);
    setIsOrderPlaced(true);
    onClearCart();
  };

  if (isOrderPlaced) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#FBF9F5] text-stone-900 px-6 text-center select-none animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
          Order Confirmed
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
          Provenance Reserved
        </h2>
        <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
          Your acquisition is now registered with Atelier Master Studios. White glove delivery scheduling has been dispatched to your email.
        </p>

        <div className="mt-5 p-4 bg-white rounded-xl border border-stone-200/80 w-full max-w-xs text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Order Reference</span>
            <span className="font-mono font-bold text-stone-900">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Estimated Dispatch</span>
            <span className="font-sans font-medium text-stone-800">Thursday, Oct 15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Courier Service</span>
            <span className="text-stone-800 font-medium">Bespoke White Glove</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsOrderPlaced(false);
            onNavigate('home');
          }}
          className="mt-6 w-full max-w-xs py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wide shadow-md"
        >
          Return to Studio Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#FBF9F5] text-stone-900 overflow-y-auto no-scrollbar pb-28 select-none">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#FBF9F5]/90 backdrop-blur-md px-5 pt-11 pb-3 flex items-center justify-between border-b border-stone-200/60">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-serif text-base font-bold text-stone-900">
          Acquisition Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
        </h1>
        <div className="w-9" />
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-14 h-14 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400 mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-800">Your bag is empty</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            Explore our curated catalog of architectural furniture and ceramic archetypes.
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="mt-4 py-2.5 px-5 bg-stone-900 text-white rounded-xl text-xs font-medium"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="px-5 pt-4 space-y-6">
          {/* Cart Item Cards */}
          <div className="space-y-3">
            {cart.map((item) => {
              const finish = item.product.finishes.find((f) => f.id === item.selectedFinishId) || item.product.finishes[0];
              return (
                <div
                  key={`${item.product.id}-${item.selectedFinishId}`}
                  className="flex bg-white rounded-xl border border-stone-200/80 p-3 gap-3 shadow-xs"
                >
                  <img
                    src={finish?.image || item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-xs font-bold text-stone-900 truncate">
                          {item.product.title}
                        </h3>
                        <p className="text-[10px] text-stone-500 truncate">{finish?.name}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedFinishId)}
                        aria-label="Remove item"
                        className="text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedFinishId, -1)}
                          className="w-5 h-5 flex items-center justify-center font-mono text-xs text-stone-700"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedFinishId, 1)}
                          className="w-5 h-5 flex items-center justify-center font-mono text-xs text-stone-700"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-stone-900">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privilege / Promo Code Form */}
          <div className="bg-white rounded-xl border border-stone-200 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
              <Tag className="w-3.5 h-3.5 text-amber-700" />
              <span>Privilege / Collector Voucher</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter ATELIER10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <button
                onClick={applyPromo}
                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
              >
                Apply
              </button>
            </div>
            {promoSuccess && <p className="text-[11px] text-emerald-700 font-medium">{promoSuccess}</p>}
            {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
          </div>

          {/* Express Payment Method Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
              Select Settlement Method
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('apple-pay')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  paymentMethod === 'apple-pay'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                Apple Pay
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setPaymentMethod('wire')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  paymentMethod === 'wire'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                Wire
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-stone-100/80 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Catalog Subtotal</span>
              <span className="font-mono text-stone-900">{formatPrice(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Privilege Discount</span>
                <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>White Glove Courier</span>
              <span className="font-mono text-stone-900">
                {shipping === 0 ? 'Complimentary' : formatPrice(shipping, currency)}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200/80 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Settlement</span>
              <span className="font-mono text-base">{formatPrice(total, currency)} {currency}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Encrypted 256-bit settlement protected by Atelier Vault.</span>
          </div>
        </div>
      )}

      {/* Sticky Bottom Order Trigger */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-t border-stone-200 px-5 py-3.5">
          <button
            onClick={handlePlaceOrder}
            className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wide flex items-center justify-between shadow-lg active:scale-[0.99] transition-transform"
          >
            <span>Authorize & Confirm ({formatPrice(total, currency)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
