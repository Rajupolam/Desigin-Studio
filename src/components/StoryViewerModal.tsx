import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Story, ScreenId } from '../types';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose, onNavigate }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!story) return;
    setSlideIdx(0);
    setProgress(0);
  }, [story]);

  useEffect(() => {
    if (!story) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (slideIdx < story.slides.length - 1) {
            setSlideIdx((s) => s + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, slideIdx, onClose]);

  if (!story) return null;

  const currentSlide = story.slides[slideIdx] || story.slides[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideIdx > 0) {
      setSlideIdx(slideIdx - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideIdx < story.slides.length - 1) {
      setSlideIdx(slideIdx + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-full max-h-[820px] bg-stone-950 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.caption}
            className="w-full h-full object-cover filter brightness-90 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/20 to-black/60" />
        </div>

        {/* Top Header & Progress Bars */}
        <div className="relative z-10 p-4 pt-6">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5 mb-3">
            {story.slides.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: i < slideIdx ? '100%' : i === slideIdx ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={story.authorAvatar}
                alt={story.author}
                className="w-8 h-8 rounded-full border border-white/50 object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white leading-tight">{story.author}</p>
                <p className="text-[10px] text-stone-300 font-mono">{story.title}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close story"
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Touch Navigation Overlay */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/2 h-full cursor-w-resize" onClick={handlePrev} />
          <div className="w-1/2 h-full cursor-e-resize" onClick={handleNext} />
        </div>

        {/* Bottom Editorial Content */}
        <div className="relative z-20 p-5 pb-8 space-y-3 pointer-events-auto">
          {currentSlide.quote && (
            <blockquote className="font-serif italic text-sm text-amber-200/95 leading-relaxed bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
              {currentSlide.quote}
            </blockquote>
          )}

          <p className="text-xs text-stone-200 font-sans leading-relaxed">
            {currentSlide.caption}
          </p>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('explore');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white text-stone-900 font-medium text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Collection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
