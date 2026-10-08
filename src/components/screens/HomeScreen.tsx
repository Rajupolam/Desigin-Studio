import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Star,
  X,
  Frown,
  SlidersHorizontal,
  Eye,
  Plus,
  Zap,
  Lightbulb,
  Check,
  Flame,
  Award,
} from 'lucide-react';
import { Product, Story, ScreenId, CurrencyCode } from '../../types';
import { formatPrice } from '../../data/mockData';
import { AudioJournalPlayer } from '../AudioJournalPlayer';

interface HomeScreenProps {
  products: Product[];
  stories: Story[];
  savedItemIds: string[];
  cartCount: number;
  currency?: CurrencyCode;
  onNavigate: (screen: ScreenId) => void;
  onSelectProduct: (product: Product) => void;
  onToggleSave: (productId: string) => void;
  onOpenStory: (story: Story) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  stories,
  savedItemIds,
  cartCount,
  currency = 'USD',
  onNavigate,
  onSelectProduct,
  onToggleSave,
  onOpenStory,
  onQuickView,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLightingTier, setSelectedLightingTier] = useState<'all' | 'low' | 'high' | 'rated'>('all');
  const [selectedBudget, setSelectedBudget] = useState<'all' | 'under300' | '300to1500' | 'over1500'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedProductIdToast, setAddedProductIdToast] = useState<string | null>(null);

  // Home showcase tab for lighting section
  const [showcaseLightingTab, setShowcaseLightingTab] = useState<'all' | 'low' | 'high' | 'rated'>('all');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter products primarily by name (title)
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products
      .filter((p) => {
        // Name filter (matches title or subtitle or designer when searching)
        const matchesName = query
          ? p.title.toLowerCase().includes(query) ||
            p.subtitle.toLowerCase().includes(query) ||
            p.designer.toLowerCase().includes(query)
          : true;

        // Category filter
        const matchesCategory =
          selectedCategory === 'All'
            ? true
            : selectedCategory === 'Lighting'
            ? p.category === 'Lighting'
            : p.category === selectedCategory;

        // Lighting tier filter (if selected)
        let matchesLightingTier = true;
        if (selectedLightingTier !== 'all') {
          if (p.category !== 'Lighting') {
            matchesLightingTier = false;
          } else if (selectedLightingTier === 'low') {
            matchesLightingTier = p.price < 300 || p.lightingTier === 'low';
          } else if (selectedLightingTier === 'high') {
            matchesLightingTier = p.price >= 1500 || p.lightingTier === 'high';
          } else if (selectedLightingTier === 'rated') {
            matchesLightingTier = p.rating >= 4.9 || p.lightingTier === 'rated';
          }
        }

        // Budget tier filter
        let matchesBudget = true;
        if (selectedBudget === 'under300') matchesBudget = p.price < 300;
        else if (selectedBudget === '300to1500') matchesBudget = p.price >= 300 && p.price <= 1500;
        else if (selectedBudget === 'over1500') matchesBudget = p.price > 1500;

        return matchesName && matchesCategory && matchesLightingTier && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // 'featured' keeps original curated order
      });
  }, [products, searchQuery, selectedCategory, selectedLightingTier, selectedBudget, sortBy]);

  // Lighting pieces for the dedicated home showcase section
  const showcaseLightingPieces = useMemo(() => {
    const allLighting = products.filter((p) => p.category === 'Lighting');
    if (showcaseLightingTab === 'low') {
      return allLighting.filter((p) => p.price < 300 || p.lightingTier === 'low');
    }
    if (showcaseLightingTab === 'high') {
      return allLighting.filter((p) => p.price >= 1500 || p.lightingTier === 'high');
    }
    if (showcaseLightingTab === 'rated') {
      return allLighting.filter((p) => p.rating >= 4.9 || p.lightingTier === 'rated');
    }
    return allLighting;
  }, [products, showcaseLightingTab]);

  const featuredProduct = products[0];
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);

  const handleSearchFocus = () => {
    searchInputRef.current?.focus();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLightingTier('all');
    setSelectedBudget('all');
    setSortBy('featured');
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedProductIdToast(product.id);
      setTimeout(() => {
        setAddedProductIdToast(null);
      }, 1800);
    }
  };

  const isFiltering =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'All' ||
    selectedLightingTier !== 'all' ||
    selectedBudget !== 'all';

  return (
    <div className="h-full flex flex-col bg-[#FBF9F5] text-stone-900 overflow-y-auto no-scrollbar pb-20 select-none">
      {/* Editorial App Header */}
      <header className="sticky top-0 z-20 bg-[#FBF9F5]/90 backdrop-blur-md px-5 pt-11 pb-3 border-b border-stone-200/60 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">
            Kyoto · Copenhagen
          </span>
          <h1 className="font-serif text-xl tracking-tight font-bold text-stone-900">ATELIER</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchFocus}
            aria-label="Focus search"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isFiltering
                ? 'bg-stone-900 text-stone-100'
                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('profile')}
            aria-label="Saved items"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 relative transition-colors"
          >
            <Heart className="w-4 h-4" />
            {savedItemIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-700 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                {savedItemIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('checkout')}
            aria-label="Shopping Bag"
            className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-100 flex items-center justify-center relative transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Product Name Search Section */}
      <section className="px-5 pt-3 pb-2 space-y-2">
        {/* Search Input Field */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-stone-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece by name (e.g. Kanso, Lamp, Lantern, Washi)..."
            className="w-full bg-white border border-stone-200/90 rounded-xl pl-9 pr-9 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-2.5 w-5 h-5 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Filter Chips with Lighting Atelier Highlight */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {[
            { id: 'All', label: 'All Catalog' },
            { id: 'Lighting', label: '💡 Lighting Atelier', isHighlight: true },
            { id: 'Furniture', label: 'Furniture' },
            { id: 'Ceramics', label: 'Ceramics' },
            { id: 'Textiles', label: 'Textiles' },
            { id: 'Objects', label: 'Objects' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (cat.id !== 'Lighting') {
                  setSelectedLightingTier('all');
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? cat.isHighlight
                    ? 'bg-amber-800 text-amber-50 shadow-2xs font-semibold'
                    : 'bg-stone-900 text-stone-50 font-semibold'
                  : cat.isHighlight
                  ? 'bg-amber-100/70 hover:bg-amber-100 text-amber-900 border border-amber-300/60'
                  : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Specialized Lighting Tier Bar (Shown when Lighting category is active or user searches for lighting) */}
        {(selectedCategory === 'Lighting' ||
          searchQuery.toLowerCase().includes('light') ||
          searchQuery.toLowerCase().includes('lamp') ||
          searchQuery.toLowerCase().includes('lantern') ||
          searchQuery.toLowerCase().includes('sconce') ||
          searchQuery.toLowerCase().includes('chandelier')) && (
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-2.5 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-700" />
                Lighting Tiers:
              </span>
              <span className="text-[10px] text-amber-800/80 font-mono">
                Low Cost · High Cost · Top Rated
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              {[
                { id: 'all', label: 'All Tiers' },
                { id: 'low', label: 'Low Cost (<$300)' },
                { id: 'high', label: 'High Cost ($1.5k+)' },
                { id: 'rated', label: 'Top Rated (★5.0)' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedLightingTier(tier.id as any)}
                  className={`py-1 px-1.5 rounded-lg text-center font-medium transition-colors text-[10px] leading-tight ${
                    selectedLightingTier === tier.id
                      ? 'bg-amber-800 text-white font-bold shadow-2xs'
                      : 'bg-white/90 hover:bg-white text-amber-950 border border-amber-200/80'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Name Suggestions Chips (when not actively typing) */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px] text-stone-500">
            <span className="shrink-0 font-mono text-[10px] text-stone-400">Search suggestions:</span>
            {[
              'Kanso',
              'Kori Lantern',
              'Aethel Lamp',
              'Equinox Chandelier',
              'Alabaster',
              'Nara Washi',
              'Sora Urn',
              'Solstice Viola',
              'Calx Sconce',
            ].map((name) => (
              <button
                key={name}
                onClick={() => setSearchQuery(name)}
                className="px-2.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-700 shrink-0 transition-colors font-sans text-[11px]"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Active Filtered Search Results View */}
      {isFiltering ? (
        <section className="px-5 pt-3 pb-6 flex-1">
          {/* Search Results Summary & Sort Controls */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">
                Filtered Pieces
              </h2>
              <p className="text-[11px] text-stone-500 font-mono">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} found
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort search results"
                className="bg-white border border-stone-200 rounded-lg text-[11px] text-stone-700 py-1 px-2 focus:outline-none cursor-pointer"
              >
                <option value="featured">Curator's Pick</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                onClick={handleClearSearch}
                className="text-[11px] font-mono text-amber-800 hover:underline shrink-0"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Zero Results State */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6 mt-2">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                <Frown className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                No pieces found matching "{searchQuery}"
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Try searching by piece name like "Kanso", "Kori", "Equinox", "Lantern", "Alabaster", or "Washi".
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
                {['Kori Lantern', 'Aethel Lamp', 'Nara Washi', 'Solstice Viola'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                onClick={handleClearSearch}
                className="mt-5 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs"
              >
                View Full Catalog
              </button>
            </div>
          ) : (
            /* Filtered Product Grid */
            <div className="grid grid-cols-2 gap-3.5">
              {filteredProducts.map((product) => {
                const isSaved = savedItemIds.includes(product.id);
                const isLighting = product.category === 'Lighting';
                const isJustAdded = addedProductIdToast === product.id;

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="cursor-pointer group flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-md transition-shadow relative"
                  >
                    {/* Image with badges */}
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Save & QuickView Actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        {onQuickView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickView(product);
                            }}
                            aria-label="Quick View"
                            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(product.id);
                          }}
                          aria-label="Save piece"
                          className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-red-500 transition-colors shadow-2xs"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isSaved ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Category & Lighting Specs Badge */}
                      <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium backdrop-blur-sm ${
                            isLighting
                              ? 'bg-amber-900/80 text-amber-100'
                              : 'bg-stone-900/80 text-stone-100'
                          }`}
                        >
                          {product.category}
                        </span>

                        {isLighting && product.lightingSpecs && (
                          <span className="text-[9px] bg-white/90 backdrop-blur-sm text-amber-900 px-1.5 py-0.5 rounded font-mono font-semibold shadow-2xs">
                            {product.lightingSpecs.colorTemperature.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content details */}
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-[10px] text-stone-500 truncate font-mono">
                          {product.designer}
                        </p>
                        <h4 className="font-serif text-sm font-semibold text-stone-900 truncate mt-0.5 group-hover:text-amber-800 transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">
                          {product.subtitle}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-900 font-sans">
                            {formatPrice(product.price, currency)}
                          </span>
                          <span className="text-[10px] text-stone-500 flex items-center gap-0.5 font-mono">
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                            {product.rating} ({product.reviewsCount})
                          </span>
                        </div>

                        {onAddToCart && (
                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            aria-label="Add to bag"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-2xs ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-900 hover:bg-stone-800 text-white'
                            }`}
                          >
                            {isJustAdded ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* Regular Editorial Feed (When not searching) */
        <>
          {/* Stories / Studio Highlights */}
          <section className="px-5 pt-2 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 font-mono">
                Studio Journals
              </span>
              <span className="text-[11px] text-stone-400">Tap to watch</span>
            </div>

            <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => onOpenStory(story)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                >
                  <div className="relative p-0.5 rounded-full ring-2 ring-amber-700/40 group-hover:ring-amber-700 transition-all">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-200">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-stone-700 max-w-[64px] truncate text-center">
                    {story.author}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Hero Curated Feature Spotlight */}
          <section className="px-5 pt-1">
            <div
              onClick={() => onSelectProduct(featuredProduct)}
              className="cursor-pointer group relative rounded-2xl overflow-hidden bg-stone-900 text-white shadow-md transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Curator's Pick of the Week</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(featuredProduct.id);
                  }}
                  aria-label="Save item"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-amber-300 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      savedItemIds.includes(featuredProduct.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-stone-950">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-1">
                  <span>{featuredProduct.designer}</span>
                  <span className="text-stone-300 font-sans font-medium text-base text-amber-200">
                    {formatPrice(featuredProduct.price, currency)}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-medium text-white group-hover:text-amber-200 transition-colors">
                  {featuredProduct.title}
                </h2>
                <p className="mt-1 text-xs text-stone-400 line-clamp-2">
                  {featuredProduct.description}
                </p>

                <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-white">{featuredProduct.rating}</span>
                    <span className="text-stone-500">({featuredProduct.reviewsCount})</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 font-medium group-hover:underline">
                    View Piece Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Dedicated Curated Lighting Atelier Showcase */}
          <section className="px-5 pt-6">
            <div className="bg-[#FAF5ED] border border-[#E9DFCE] rounded-2xl p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-800" />
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      The Lighting Atelier
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Architectural fixtures, washi lanterns & kinetic mobiles
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('Lighting');
                    searchInputRef.current?.focus();
                  }}
                  className="text-xs font-mono font-medium text-amber-800 hover:underline shrink-0"
                >
                  Explore All ({products.filter((p) => p.category === 'Lighting').length})
                </button>
              </div>

              {/* Lighting Tier Selection Tabs: Low Cost, High Cost, Top Rated */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All Lighting' },
                  { id: 'low', label: 'Low Cost (<$300)' },
                  { id: 'high', label: 'High Cost ($1.5k+)' },
                  { id: 'rated', label: '★ Top Rated (4.9-5.0)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setShowcaseLightingTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                      showcaseLightingTab === tab.id
                        ? 'bg-amber-900 text-amber-50 font-bold shadow-2xs'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Horizontal Scrollable Lighting Showcase Cards */}
              <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pt-1 pb-1">
                {showcaseLightingPieces.map((piece) => (
                  <div
                    key={piece.id}
                    onClick={() => onSelectProduct(piece)}
                    className="w-48 shrink-0 bg-white rounded-xl border border-stone-200/90 overflow-hidden cursor-pointer group hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={piece.images[0]}
                        alt={piece.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 text-[9px] bg-stone-900/80 backdrop-blur-sm text-stone-100 px-1.5 py-0.5 rounded font-mono font-semibold">
                        {piece.price < 300
                          ? 'Low Cost'
                          : piece.price >= 1500
                          ? 'High Cost'
                          : 'Curated'}
                      </span>
                      {piece.lightingSpecs && (
                        <span className="absolute bottom-2 left-2 text-[9px] bg-amber-900/80 backdrop-blur-sm text-amber-100 px-1.5 py-0.5 rounded font-mono">
                          {piece.lightingSpecs.colorTemperature.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-[10px] text-stone-500 font-mono truncate">
                          {piece.designer}
                        </p>
                        <h4 className="font-serif text-xs font-bold text-stone-900 truncate mt-0.5 group-hover:text-amber-800">
                          {piece.title}
                        </h4>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          {formatPrice(piece.price, currency)}
                        </span>
                        <span className="text-[10px] text-stone-600 flex items-center gap-0.5 font-mono">
                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          {piece.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Curator's Audio Journal & Manifesto Section */}
          <section className="px-5 pt-5 space-y-3">
            <AudioJournalPlayer
              title="The Architecture of Tactility"
              speaker="Maya Lindqvist · Senior Curator"
              durationSeconds={112}
              transcript="In this season's archive, we shifted away from polished synthetic resin toward Roman travertine and smoked walnut. The irregularities of porous stone create an immediate sensory anchor in high-density urban residences."
            />

            <div className="bg-[#F0EBE1] border border-[#E3DACB] rounded-xl p-4">
              <p className="text-[10px] tracking-widest uppercase font-mono text-stone-600 mb-1">
                Material Manifesto
              </p>
              <blockquote className="font-serif italic text-sm text-stone-800 leading-snug">
                “True luxury in domestic spaces is not decoration, but the honest resonance of untreated stone, linen, and aged wood.”
              </blockquote>
              <div className="mt-2 text-[11px] text-stone-600 font-sans font-medium flex items-center justify-between">
                <span>— Studio Oki & Atelier Collective</span>
                <span className="text-amber-800 underline font-mono text-[10px]">Edition No. 04</span>
              </div>
            </div>
          </section>

          {/* Trending Design Pieces */}
          <section className="px-5 pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Trending Archetypes</h3>
                <p className="text-[11px] text-stone-500">Sculptural objects currently in high demand</p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-0.5"
              >
                See all ({products.length})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {trendingProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="cursor-pointer group flex flex-col bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(product.id);
                      }}
                      aria-label="Save item"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-red-500 transition-colors shadow-2xs"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          savedItemIds.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-2 left-2 text-[10px] bg-stone-900/70 backdrop-blur-sm text-stone-100 px-1.5 py-0.5 rounded font-mono">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-[10px] text-stone-500 truncate font-mono">{product.designer}</p>
                      <h4 className="font-serif text-sm font-medium text-stone-900 truncate mt-0.5 group-hover:text-amber-800">
                        {product.title}
                      </h4>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        {formatPrice(product.price, currency)}
                      </span>
                      <span className="text-[10px] text-stone-500 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
