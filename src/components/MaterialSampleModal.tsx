import React, { useState } from 'react';
import { X, Check, Package, Send, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface MaterialSampleModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MaterialSampleModal: React.FC<MaterialSampleModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(
    product?.finishes.map((f) => f.id) || []
  );
  const [name, setName] = useState('Aria Montgomery');
  const [address, setAddress] = useState('42 Sakyo-ku, Kyoto 606-8305, Japan');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const toggleFinish = (id: string) => {
    setSelectedFinishes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-stone-900">
                Tactile Material Swatches
              </h3>
              <p className="text-[10px] text-stone-500 font-mono">
                Complimentary Studio Sample Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900">
              Sample Kit Dispatched
            </h4>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              Your physical material swatch set for <span className="font-semibold">{product.title}</span> has been prepared and scheduled with DHL Express Courier.
            </p>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-1 font-mono">
              <p className="text-stone-500">Tracking Code: <span className="text-stone-900 font-bold">DHL-ATL-89210</span></p>
              <p className="text-stone-500">Destination: <span className="text-stone-800 font-sans">{address}</span></p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full mt-2 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                Select Swatches to Receive (Complimentary)
              </span>
              <div className="space-y-2">
                {product.finishes.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => toggleFinish(f.id)}
                    className={`cursor-pointer flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      selectedFinishes.includes(f.id)
                        ? 'border-stone-900 bg-stone-50 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: f.colorHex }}
                      />
                      <span className="font-medium text-stone-800">{f.name}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        selectedFinishes.includes(f.id)
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {selectedFinishes.includes(f.id) && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div>
                <label className="text-[10px] font-mono text-stone-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-0.5 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-stone-500 uppercase">Dispatch Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-0.5 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Complimentary international shipping included for registered curators.</span>
            </div>

            <button
              type="submit"
              disabled={selectedFinishes.length === 0}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Swatches ({selectedFinishes.length})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
