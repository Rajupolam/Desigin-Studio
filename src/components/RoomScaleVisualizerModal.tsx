import React, { useState } from 'react';
import { X, Sun, Moon, Move, Sparkles, ShoppingBag, Eye, RotateCcw } from 'lucide-react';
import { Product, RoomScene } from '../types';
import { ROOM_SCENES } from '../data/mockData';

interface RoomScaleVisualizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const RoomScaleVisualizerModal: React.FC<RoomScaleVisualizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedScene, setSelectedScene] = useState<RoomScene>(ROOM_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<string>(
    ROOM_SCENES[0].lightingOptions[0].id
  );
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [posX, setPosX] = useState<number>(50); // percentage
  const [posY, setPosY] = useState<number>(65); // percentage
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  if (!isOpen || !product) return null;

  const currentLighting =
    selectedScene.lightingOptions.find((l) => l.id === selectedLighting) ||
    selectedScene.lightingOptions[0];

  const handleResetPosition = () => {
    setScalePercent(100);
    setPosX(50);
    setPosY(65);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-stone-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <span>Architectural Room Scale Visualizer</span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  Spatial Mode
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Preview <span className="text-white font-medium">{product.title}</span> in domestic architectural environments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visualizer Canvas Area */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[460px] bg-stone-900 overflow-hidden">
          {/* Architectural Room Backdrop */}
          <div className={`absolute inset-0 transition-all duration-700 ${currentLighting.filterClass}`}>
            <img
              src={selectedScene.backgroundImage}
              alt={selectedScene.name}
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
          </div>

          {/* Interactive Object Placed in Room */}
          <div
            className="absolute transition-transform duration-75 cursor-grab active:cursor-grabbing flex flex-col items-center select-none"
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `translate(-50%, -50%) scale(${scalePercent / 100})`,
            }}
          >
            <div className="relative group">
              {/* Drop Shadow matching architectural lighting */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/60 blur-md rounded-full -z-10"
              />

              <img
                src={product.finishes[0]?.image || product.images[0]}
                alt={product.title}
                className="max-h-56 sm:max-h-64 object-contain filter drop-shadow-2xl transition-all"
                draggable={false}
              />

              {/* Floating Dimension Guides */}
              {showDimensions && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md text-amber-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap shadow-lg">
                  {product.dimensions}
                </div>
              )}
            </div>
          </div>

          {/* Canvas Floating Top Controls: Room Scene Switcher */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto">
              {ROOM_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setSelectedScene(scene);
                    setSelectedLighting(scene.lightingOptions[0].id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedScene.id === scene.id
                      ? 'bg-white text-stone-900 shadow-md font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {scene.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Lighting Mode Selector */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto">
              <Sun className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              {selectedScene.lightingOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedLighting(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    selectedLighting === opt.id
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {opt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Position Guide Indicator */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-stone-300 flex items-center gap-2">
            <Move className="w-3.5 h-3.5 text-stone-400" />
            <span>Drag sliders below to reposition or resize</span>
          </div>
        </div>

        {/* Modal Bottom Tuning Controls */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
            {/* Scale Adjuster */}
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span>Scale Proportion</span>
                <span className="font-mono text-amber-300">{scalePercent}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={scalePercent}
                onChange={(e) => setScalePercent(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Placement X & Y Sliders */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-stone-300 mb-1">
                  <span>Horizontal (X)</span>
                  <span className="font-mono text-stone-400">{posX}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full accent-stone-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-stone-300 mb-1">
                  <span>Vertical (Y)</span>
                  <span className="font-mono text-stone-400">{posY}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="85"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full accent-stone-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setShowDimensions(!showDimensions)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  showDimensions
                    ? 'border-amber-500/50 text-amber-300 bg-amber-950/40'
                    : 'border-stone-700 text-stone-400 hover:text-white'
                }`}
              >
                Dimensions
              </button>
              <button
                onClick={handleResetPosition}
                className="p-2 rounded-xl border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Reset Position"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Acquire Piece (${product.price.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
