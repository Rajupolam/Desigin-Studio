import React, { useState } from 'react';
import { X, Code, Image as ImageIcon, Sparkles, Check, Link, RotateCcw } from 'lucide-react';
import { HOTLINK_PRESETS } from '../data/mockData';

interface ImageHotlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyHotlinks: (imageUrls: string[]) => void;
  onResetDefaults: () => void;
  currentHeroImage: string;
}

export const ImageHotlinkModal: React.FC<ImageHotlinkModalProps> = ({
  isOpen,
  onClose,
  onApplyHotlinks,
  onResetDefaults,
  currentHeroImage,
}) => {
  const [htmlInput, setHtmlInput] = useState('');
  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const [appliedNotice, setAppliedNotice] = useState(false);

  if (!isOpen) return null;

  // Extract images from HTML or text
  const handleParseHtml = (rawText: string) => {
    setHtmlInput(rawText);
    const urls: string[] = [];

    // 1. Regex for <img ... src="..." />
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(rawText)) !== null) {
      if (match[1]) urls.push(match[1]);
    }

    // 2. Also check for raw http/https image links if no <img> tag found
    if (urls.length === 0) {
      const urlRegex = /(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif|svg)(?:\?[^\s"'<>]*)?)/gi;
      let urlMatch;
      while ((urlMatch = urlRegex.exec(rawText)) !== null) {
        if (urlMatch[1]) urls.push(urlMatch[1]);
      }
    }

    // 3. Fallback check for unsplash urls with query params
    if (urls.length === 0) {
      const unsplashRegex = /(https?:\/\/images\.unsplash\.com\/[^\s"'<>]+)/gi;
      let uMatch;
      while ((uMatch = unsplashRegex.exec(rawText)) !== null) {
        if (uMatch[1]) urls.push(uMatch[1]);
      }
    }

    setExtractedUrls(Array.from(new Set(urls)));
  };

  const handleApplyExtracted = () => {
    if (extractedUrls.length === 0) return;
    onApplyHotlinks(extractedUrls);
    setAppliedNotice(true);
    setTimeout(() => {
      setAppliedNotice(false);
      onClose();
    }, 1500);
  };

  const handleApplyPreset = (presetImages: { url: string }[]) => {
    const urls = presetImages.map((p) => p.url);
    onApplyHotlinks(urls);
    setAppliedNotice(true);
    setTimeout(() => {
      setAppliedNotice(false);
      onClose();
    }, 1500);
  };

  const sampleHtmlSnippet = `<!-- Sample HTML snippet with hotlink images -->
<div class="gallery">
  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" alt="Architecture" />
  <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80" alt="Lounge Chair" />
  <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80" alt="Travertine Lamp" />
</div>`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-200 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">
                HTML Image Hotlinker & Extractor
              </h2>
              <p className="text-[11px] text-stone-500">
                Paste HTML containing &lt;img&gt; tags to extract and hotlink images across all screens
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                Curated Aesthetic Presets
              </span>
              <button
                onClick={onResetDefaults}
                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOTLINK_PRESETS.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.images)}
                  className="cursor-pointer group p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 hover:border-stone-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-xs font-bold text-stone-900">{preset.name}</h4>
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">{preset.description}</p>
                  </div>
                  <div className="flex gap-1.5 mt-2.5 overflow-hidden">
                    {preset.images.slice(0, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt=""
                        className="w-10 h-10 rounded-md object-cover bg-stone-200 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HTML Paste Extractor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />
                <span>Paste HTML Code or Image URLs</span>
              </label>
              <button
                onClick={() => handleParseHtml(sampleHtmlSnippet)}
                className="text-[11px] text-amber-800 hover:underline font-mono"
              >
                Insert Sample HTML
              </button>
            </div>

            <textarea
              rows={4}
              value={htmlInput}
              onChange={(e) => handleParseHtml(e.target.value)}
              placeholder="Paste HTML with <img src='...' /> tags or image URLs here..."
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Extracted Images Preview */}
          {extractedUrls.length > 0 && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                  <span>Found {extractedUrls.length} Hotlinked Images</span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Ready to inject into screens</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {extractedUrls.slice(0, 8).map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-stone-200 border border-stone-300 group">
                    <img src={url} alt={`Hotlink ${i + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded font-mono">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApplyExtracted}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Hotlink Extracted Images Into App Screens</span>
              </button>
            </div>
          )}

          {/* Current Active Hero Indicator */}
          <div className="p-3 bg-stone-100/70 rounded-xl flex items-center gap-3 text-xs">
            <img
              src={currentHeroImage}
              alt="Active Hero"
              className="w-12 h-12 rounded-lg object-cover bg-stone-300 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-stone-900">Current Active Hero Hotlink</p>
              <p className="text-[10px] text-stone-500 truncate font-mono">{currentHeroImage}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            {appliedNotice ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Screens successfully updated!
              </span>
            ) : (
              'Hotlinks sync instantly across all 6 app screens.'
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
