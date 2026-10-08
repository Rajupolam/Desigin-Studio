import React, { useState } from 'react';
import { UserProfile, Product, ScreenId, CurrencyCode, Moodboard, OrderRecord } from '../../types';
import { Settings, Heart, Layers, Clock, Globe, ArrowUpRight, Trash2, Sliders, Plus, Award, Check } from 'lucide-react';
import { INITIAL_MOODBOARDS, ORDER_RECORDS, formatPrice } from '../../data/mockData';

interface ProfileScreenProps {
  user: UserProfile;
  products: Product[];
  savedItemIds: string[];
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectProduct: (product: Product) => void;
  onToggleSave: (productId: string) => void;
  onOpenHotlinkModal: () => void;
  onViewCertificate?: (order: OrderRecord) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  products,
  savedItemIds,
  currency,
  onSelectCurrency,
  onSelectProduct,
  onToggleSave,
  onOpenHotlinkModal,
  onViewCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'moodboards' | 'orders' | 'settings'>('saved');
  const [haptics, setHaptics] = useState(true);
  const [moodboards, setMoodboards] = useState<Moodboard[]>(INITIAL_MOODBOARDS);
  const [isCreatingMoodboard, setIsCreatingMoodboard] = useState(false);
  const [newMbTitle, setNewMbTitle] = useState('');
  const [newMbRoom, setNewMbRoom] = useState('Living Space');

  const savedProducts = products.filter((p) => savedItemIds.includes(p.id));

  const handleCreateMoodboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMbTitle.trim()) return;

    const newMb: Moodboard = {
      id: `mb-${Date.now()}`,
      title: newMbTitle.trim(),
      roomType: newMbRoom,
      itemIds: savedItemIds.slice(0, 3),
      notes: 'Custom curated domestic ensemble created in Atelier Vault.',
      createdAt: 'Just now',
    };

    setMoodboards([newMb, ...moodboards]);
    setNewMbTitle('');
    setIsCreatingMoodboard(false);
  };

  const handleDeleteMoodboard = (id: string) => {
    setMoodboards(moodboards.filter((m) => m.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-[#FBF9F5] text-stone-900 overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Editorial Profile Header */}
      <div className="px-5 pt-11 pb-4 bg-stone-950 text-white relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200/90">
            {user.membershipTier}
          </span>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300/40 shrink-0">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>

          <div className="min-w-0">
            <h1 className="font-serif text-lg font-bold text-white truncate">{user.name}</h1>
            <p className="text-xs text-stone-400 font-mono truncate">{user.handle}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-300 mt-1">
              <Globe className="w-3 h-3 text-stone-400" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-300 mt-3.5 leading-relaxed font-sans line-clamp-2">
          {user.bio}
        </p>

        {/* Curator Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-800 text-center">
          <div>
            <span className="font-mono text-sm font-bold text-amber-200">{savedItemIds.length}</span>
            <span className="block text-[10px] text-stone-400 uppercase font-mono">Saved</span>
          </div>
          <div>
            <span className="font-mono text-sm font-bold text-amber-200">{user.moodboardsCount}</span>
            <span className="block text-[10px] text-stone-400 uppercase font-mono">Moodboards</span>
          </div>
          <div>
            <span className="font-mono text-sm font-bold text-amber-200">{user.ordersCount}</span>
            <span className="block text-[10px] text-stone-400 uppercase font-mono">Acquisitions</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-[#FBF9F5] border-b border-stone-200 px-5 flex items-center gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3 relative flex items-center gap-1.5 transition-colors ${
            activeTab === 'saved' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved ({savedItemIds.length})</span>
          {activeTab === 'saved' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('moodboards')}
          className={`py-3 relative flex items-center gap-1.5 transition-colors ${
            activeTab === 'moodboards' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Moodboards</span>
          {activeTab === 'moodboards' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 relative flex items-center gap-1.5 transition-colors ${
            activeTab === 'orders' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>History</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 relative flex items-center gap-1.5 transition-colors ${
            activeTab === 'settings' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Studio</span>
          {activeTab === 'settings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="px-5 pt-4">
        {activeTab === 'saved' && (
          <div>
            {savedProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Heart className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="font-serif text-sm font-semibold text-stone-700">No saved objects yet</p>
                <p className="text-xs text-stone-400 mt-0.5">Tap the heart on any piece to add to your private archive</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="cursor-pointer group bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs relative"
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(product.id);
                        }}
                        aria-label="Remove from saved"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-white shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5">
                      <p className="text-[10px] text-stone-400 font-mono truncate">{product.designer}</p>
                      <h4 className="font-serif text-xs font-semibold text-stone-900 truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs font-bold text-stone-900 mt-1">
                        {formatPrice(product.price, currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Moodboards Interactive Canvas */}
        {activeTab === 'moodboards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-stone-900">Spatial Moodboards</h3>
                <p className="text-[10px] text-stone-500">Curated domestic compositions</p>
              </div>
              <button
                onClick={() => setIsCreatingMoodboard(!isCreatingMoodboard)}
                className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Board</span>
              </button>
            </div>

            {/* New Moodboard Drawer */}
            {isCreatingMoodboard && (
              <form onSubmit={handleCreateMoodboard} className="p-3.5 bg-white rounded-xl border border-stone-300 space-y-3 animate-in fade-in">
                <h4 className="font-serif text-xs font-bold text-stone-900">Create Curated Moodboard</h4>
                <div>
                  <label className="text-[10px] font-mono uppercase text-stone-500">Board Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kyoto Garden Library"
                    value={newMbTitle}
                    onChange={(e) => setNewMbTitle(e.target.value)}
                    className="w-full mt-0.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-stone-500">Room Category</label>
                  <select
                    value={newMbRoom}
                    onChange={(e) => setNewMbRoom(e.target.value)}
                    className="w-full mt-0.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs"
                  >
                    <option value="Living Sanctuary">Living Sanctuary</option>
                    <option value="Tea Pavilion">Tea Pavilion</option>
                    <option value="Studio & Library">Studio & Library</option>
                    <option value="Dining Gallery">Dining Gallery</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCreatingMoodboard(false)}
                    className="flex-1 py-1.5 border border-stone-200 rounded-lg text-xs text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
                  >
                    Save Moodboard
                  </button>
                </div>
              </form>
            )}

            {/* Moodboard Cards */}
            {moodboards.map((mb) => {
              const mbItems = products.filter((p) => mb.itemIds.includes(p.id));
              const totalMbCost = mbItems.reduce((acc, p) => acc + p.price, 0);

              return (
                <div key={mb.id} className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2.5 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-bold text-stone-900">{mb.title}</h4>
                        <span className="text-[9px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {mb.roomType}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-sans">{mb.notes}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMoodboard(mb.id)}
                      className="text-stone-400 hover:text-red-500 p-1"
                      title="Delete moodboard"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {mbItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 group">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1 rounded truncate max-w-[80px]">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-mono">Curated Total:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {formatPrice(totalMbCost, currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Orders with Certificate Verification */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {ORDER_RECORDS.map((order) => (
              <div key={order.id} className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{order.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {formatPrice(order.price, currency)}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <img
                    src={order.product.images[0]}
                    alt={order.product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-stone-900 truncate">{order.product.title}</p>
                    <p className="text-[11px] text-stone-500 truncate">{order.finishName}</p>
                    <p className="text-[10px] font-mono text-stone-400 mt-0.5">Serial: {order.serialNumber}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono">Dispatched {order.date}</span>

                  {onViewCertificate && (
                    <button
                      onClick={() => onViewCertificate(order)}
                      className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-md text-[11px] font-medium flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Provenance Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 text-xs">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Studio Preferences</h3>

              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-700">Display Currency</span>
                <div className="flex gap-1">
                  {(['USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => onSelectCurrency(curr)}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                        currency === curr
                          ? 'bg-stone-900 text-white font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-700">Tactile Micro-interactions</span>
                <input
                  type="checkbox"
                  checked={haptics}
                  onChange={(e) => setHaptics(e.target.checked)}
                  className="accent-stone-900 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenHotlinkModal}
                  className="w-full py-2.5 px-3 bg-amber-950 text-amber-100 rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:bg-amber-900 transition-colors"
                >
                  <span>Open HTML Image Hotlinker & Extractor</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-stone-400 mt-1.5 text-center">
                  Hotlink images by pasting HTML markup or image URLs
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
