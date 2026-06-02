import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, ShoppingCart, SlidersHorizontal, LayoutGrid, List, ChevronDown, X } from 'lucide-react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';
import BackButton from './BackButton';

interface SearchResultsPageProps {
  query: string;
  category: string;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
  allProducts: Product[];
  isWishlist?: boolean;
  savedProducts?: string[];
  onToggleSave?: (productId: string) => void;
  onBuyNow?: (product: Product) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ 
  query, 
  category, 
  onAddToCart, 
  onProductClick, 
  onBack, 
  allProducts,
  isWishlist = false,
  savedProducts = [],
  onToggleSave,
  onBuyNow
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProducts = allProducts.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.brand?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = isWishlist || category === 'All' || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20 sm:pt-32 pb-20 sm:pb-24">
      {/* Search Header */}
      <div className="max-w-[95%] mx-auto px-4 sm:px-8 mb-6">
        <BackButton onBack={onBack} label={isWishlist ? 'Back to Home' : 'Back to Home'} className="mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:py-6 border-b border-gray-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Search Results</span>
            <h1 className="text-xl sm:text-2xl font-serif text-gray-900">
              {isWishlist ? 'Your Saved Medical Items' : (
                <> {filteredProducts.length} results for <span className="text-primary-600">"{query || category}"</span> </>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">Filters</span>
            </button>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase mr-2">Sort:</span>
              <select className="text-[10px] font-bold text-gray-900 uppercase tracking-tight bg-transparent border-none outline-none focus:ring-0 cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[95%] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center justify-between">Filters<SlidersHorizontal className="w-4 h-4 text-gray-400" /></h3>
              <div className="space-y-4 mb-8">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</h4>
                <div className="space-y-2">
                  {['All', 'Instruments', 'Surgical Wear', 'Diagnostic', 'Wound Care'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500/20" />
                      <span className="text-xs text-gray-600 group-hover:text-primary-600 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price Range</h4>
                <div className="space-y-2">
                  {['Under $25', '$25 to $50', '$50 to $100', 'Over $100'].map(price => (
                    <button key={price} className="block text-xs text-gray-600 hover:text-primary-600 transition-colors">{price}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-primary-500/5 rounded-3xl p-6 border border-primary-500/10">
              <h4 className="text-sm font-serif text-primary-900 mb-2">Expert Consultation</h4>
              <p className="text-[10px] text-primary-700 leading-relaxed mb-4">Need help choosing the right instrument?</p>
              <button className="w-full bg-primary-500 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20">Chat with Specialist</button>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-[150] bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-50 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Department</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Instruments', 'Surgical Wear', 'Diagnostic', 'Wound Care'].map(cat => (
                      <button key={cat} className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600">{cat}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Under $25', '$25-$50', '$50-$100', '$100+'].map(price => (
                      <button key={price} className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600">{price}</button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowMobileFilters(false)} className="w-full mt-6 bg-primary-500 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest">Apply Filters</button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <main className="flex-1">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} onClick={() => onProductClick(product)} className="cursor-pointer">
                    <ProductCard 
                      product={product} 
                      onAddToCart={onAddToCart} 
                      isSaved={savedProducts.includes(product.id)}
                      onToggleSave={onToggleSave}
                      onBuyNow={onBuyNow}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 sm:py-32 text-center">
                <Search className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3">No matches found</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">Try different keywords or browse our departments.</p>
                <button onClick={onBack} className="bg-primary-500 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20">Return to Home</button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;

