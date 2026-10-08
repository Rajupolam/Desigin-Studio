import React from 'react';
import { X, Award, ShieldCheck, Download, Share2, Check } from 'lucide-react';
import { OrderRecord } from '../types';

interface CertificateModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#FAF8F5] text-stone-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D9D0C1] p-6 sm:p-8 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Archival Decorative Border Frame */}
        <div className="border border-[#C8BDAB] p-6 sm:p-7 rounded-2xl relative bg-[#FCFBF8] space-y-5 text-center">
          {/* Atelier Seal */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-amber-800/40 bg-amber-50 text-amber-900 flex items-center justify-center mb-2 shadow-xs">
              <Award className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-stone-500">
              Atelier Master Studio Archive
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Certificate of Provenance
            </h2>
            <p className="text-xs text-stone-500 font-sans italic mt-0.5">
              Verified Original Edition & Architectural Authenticity
            </p>
          </div>

          <div className="w-24 h-px bg-[#D9D0C1] mx-auto" />

          {/* Piece Record Details */}
          <div className="space-y-3 text-xs text-left">
            <div className="flex justify-between items-baseline border-b border-stone-200/80 pb-1.5">
              <span className="text-stone-500 font-mono text-[10px] uppercase">Acquired Piece</span>
              <span className="font-serif font-bold text-sm text-stone-900">{order.product.title}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-stone-200/80 pb-1.5">
              <span className="text-stone-500 font-mono text-[10px] uppercase">Specification</span>
              <span className="font-sans text-stone-800">{order.finishName}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-stone-200/80 pb-1.5">
              <span className="text-stone-500 font-mono text-[10px] uppercase">Edition Serial</span>
              <span className="font-mono font-bold text-amber-900">{order.serialNumber}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-stone-200/80 pb-1.5">
              <span className="text-stone-500 font-mono text-[10px] uppercase">Maker / Atelier</span>
              <span className="font-serif italic text-stone-900 font-medium">{order.artisanSignature}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-stone-200/80 pb-1.5">
              <span className="text-stone-500 font-mono text-[10px] uppercase">Material Provenance</span>
              <span className="text-stone-800 text-right max-w-[220px] truncate">{order.harvestLocation}</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-stone-500 font-mono text-[10px] uppercase">Archival Record Date</span>
              <span className="font-mono text-stone-700">{order.date}</span>
            </div>
          </div>

          {/* Artisan Signature Stamp */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographically Verified</span>
            </div>

            <div className="text-right">
              <span className="font-serif italic text-xs font-bold text-stone-800 block">
                {order.artisanSignature}
              </span>
              <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                Master Signatory Seal
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`Provenance Certificate: ${order.product.title} [${order.serialNumber}]`);
              }
            }}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Archival Link</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Close Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
