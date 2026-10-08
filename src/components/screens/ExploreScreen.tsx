import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid, List, Heart, X, Star, Eye, Plus } from 'lucide-react';
import { Product, ScreenId, CurrencyCode } from '../../types';
import { formatPrice } from '../../data/mockData';

interface ExploreScreenProps {
  products: Product[];
  savedItemIds: string[];
  currency?: CurrencyCode;
  onNavigate: (screen: ScreenId) => void;
  onSelectProduct: (product: Product) => void;
  onToggleSave: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const CATEGORIES = ['All', 'Furniture', 'Lighting', 'Ceramics', 'Textiles', 'Objects'];

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  products,
  savedItemIds,
  currency = 'USD',
  onSelectProduct,
  onToggleSave,
  onQuickView,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesQuery =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPrice = p.price <= maxPrice;
        const matchesStock = inStockOnly ? !p.leadTime.includes('weeks') : true;
        return matchesCategory && matchesQuery && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="h-full flex flex-col bg-[#FBF9F5] text-stone-900 overflow-y-auto no-scrollbar pb-20 select-none">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-20 bg-[#FBF9F5]/90 backdrop-blur-md px-5 pt-11 pb-3 border-b border-stone-200/60">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">Curated Archive</span>
            <h1 className="font-serif text-xl font-bold text-stone-900">Explore Catalog</h1>
          </div>
          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Filter trigger */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wood, travertine, ceramics..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            aria-label="Open Filter Controls"
            className="p-2 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 rounded-xl text-stone-700 relative transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {(maxPrice < 2500 || inStockOnly) && (
              <span className="w-2 h-2 rounded-full bg-amber-600 absolute top-1 right-1" />
            )}
          </button>
        </div>

        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-stone-50'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between text-xs text-stone-500 font-mono">
        <span>Showing {filteredProducts.length} objects</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-transparent border-none text-xs text-stone-700 font-sans focus:outline-none cursor-pointer"
        >
          <option value="featured">Sort: Curators' Pick</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Feed */}
      <div className="px-5 pt-1">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-base text-stone-700">No objects match your filter</p>
            <p className="text-xs text-stone-400 mt-1">Try resetting search query or price limits</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(2500);
                setInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer group flex flex-col bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:shadow-md transition-shadow relative"
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
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-red-500 transition-colors shadow-xs"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        savedItemIds.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-stone-800 flex items-center gap-1 shadow-xs hover:bg-white"
                    >
                      <Eye className="w-3 h-3" /> Quick View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      aria-label="Add to cart"
                      className="w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center text-white shadow-xs hover:bg-stone-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block truncate">
                      {product.designer}
                    </span>
                    <h3 className="font-serif text-xs font-semibold text-stone-900 truncate mt-0.5 group-hover:text-amber-800">
                      {product.title}
                    </h3>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
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
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer group flex bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:shadow-md transition-shadow p-2.5 gap-3"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-mono truncate">{product.category}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(product.id);
                        }}
                        aria-label="Save"
                        className="text-stone-400 hover:text-red-500"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            savedItemIds.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <h3 className="font-serif text-sm font-semibold text-stone-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 truncate">{product.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-stone-900">
                      {formatPrice(product.price, currency)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-[11px] font-medium"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet / Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-base font-bold text-stone-900">Refine Collection</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-stone-700">Maximum Price</span>
                <span className="font-mono font-bold text-stone-900">{formatPrice(maxPrice, currency)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>{formatPrice(100, currency)}</span>
                <span>{formatPrice(5000, currency)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-stone-800">In Stock for Immediate Dispatch</p>
                <p className="text-[10px] text-stone-500">Excludes custom made-to-order commissions</p>
              </div>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-stone-900 rounded cursor-pointer"
              />
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => {
                  setMaxPrice(2500);
                  setInStockOnly(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
