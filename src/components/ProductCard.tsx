import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Flame, Award, Zap, Heart } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isSaved?: boolean;
  onToggleSave?: (productId: string) => void;
  onBuyNow?: (product: Product) => void;
}

// Deterministic badge assignment based on product id
function getPromoInfo(product: Product): { label: string; color: string; icon?: React.ReactNode } | null {
  const idNum = parseInt(product.id, 10) || 0;
  const originalPrice = product.price * 1.25;
  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  if (product.rating >= 4.9) return { label: 'Best Seller', color: 'bg-amber-500', icon: <Flame className="w-2.5 h-2.5" /> };
  if (product.rating >= 4.8) return { label: `${discountPct}% OFF`, color: 'bg-emerald-500', icon: <Zap className="w-2.5 h-2.5" /> };
  if (idNum % 4 === 0)       return { label: 'New Arrival', color: 'bg-blue-500', icon: <Award className="w-2.5 h-2.5" /> };
  if (idNum % 3 === 0)       return { label: '20% OFF', color: 'bg-rose-500' };
  return null;
}

const slogans: Record<string, string> = {
  '1':  '"Cut with confidence"',
  '2':  '"Glove up, stay safe"',
  '3':  '"Breathe easier"',
  '4':  '"Monitor. Prevent. Protect."',
  '5':  '"Heal faster, heal better"',
  '6':  '"Pure care, every layer"',
  '7':  '"Oxygen. Measured. Trusted."',
  '8':  '"Temperature-perfect care"',
  '9':  '"Know your numbers"',
  '10': '"Precision at your fingertips"',
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isSaved = false, onToggleSave, onBuyNow }) => {
  if (!product) return null;
  const promo = getPromoInfo(product);
  const slogan = slogans[product.id];

  const price = typeof product.price === 'number' ? product.price : 0;
  const stock = Number(product.stock_quantity ?? 0);
  const mrpVal = product.mrp || (price * 1.25);
  const discountPct = Math.round(((mrpVal - price) / mrpVal) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-[0_8px_20px_-12px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.28)] transition-all duration-500 h-full flex flex-col relative cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-gradient-to-b from-gray-50 to-white flex-shrink-0 border-b border-gray-100">
        <motion.img 
          src={product.image || ''} 
          alt={product.name || 'Product'}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400';
          }}
        />

        {/* Promo Badge - top left */}
        {promo && (
          <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10 ${promo.color} text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1 shadow-lg`}>
            {promo.icon}
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wide sm:tracking-wider">{promo.label}</span>
          </div>
        )}

        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[7px] sm:text-[8px] font-bold uppercase tracking-wide sm:tracking-wider border border-white shadow-sm">
            {product.category?.split(' ')[0] || 'Medical'}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave?.(product.id); }}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSaved 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                : 'bg-white/95 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:scale-110 shadow-md border border-gray-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover overlay with slogan */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-400 flex items-end p-3">
          {slogan && (
            <p className="text-white text-[9px] font-medium leading-tight">{slogan}</p>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          {product.brand === 'Test One' && (
            <span className="bg-gold-50 text-gold-600 border border-gold-200 text-[7px] font-extrabold uppercase px-1 rounded">Test One</span>
          )}
          {product.code && (
            <span className="text-[8px] font-mono text-gray-400 font-semibold uppercase">{product.code}</span>
          )}
          {product.gst && (
            <span className="text-[8px] text-gray-400 font-bold ml-auto">GST: {product.gst}</span>
          )}
        </div>

        <h3 className="text-[12px] sm:text-[15px] font-semibold text-gray-900 mb-1.5 sm:mb-2 leading-snug group-hover:text-gold-700 transition-colors line-clamp-2 min-h-[2.2rem] sm:min-h-[2.6rem]">
          {product.name || 'Untitled Product'}
        </h3>

        <div className="mb-1.5 sm:mb-3">
          <p className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-gray-400">Institutional Pricing</p>
          <p className="sm:hidden text-[8px] uppercase tracking-[0.12em] text-gray-400">Pro Price</p>
        </div>

        <div className="flex items-baseline justify-between mb-3 border-t border-gray-50 pt-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-[14px] sm:text-[16px] font-black text-gray-900 leading-none">₹{price.toLocaleString('en-IN')}</span>
              {mrpVal > price && (
                <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">₹{mrpVal.toLocaleString('en-IN')}</span>
              )}
            </div>
            {discountPct > 0 && (
              <p className="text-[8px] sm:text-[9.5px] text-emerald-600 font-bold mt-0.5">Save {discountPct}%</p>
            )}
          </div>
          
          {stock === 0 ? (
            <span className="text-[8px] font-extrabold uppercase text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md">Out of Stock</span>
          ) : (
            <span className="text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">In Stock</span>
          )}
        </div>

        {/* Buttons Action Block side by side */}
        {stock > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onBuyNow?.(product); }}
              className="w-full h-8 rounded-lg bg-gold-600 text-white hover:bg-gold-700 transition-all active:scale-95 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider flex items-center justify-center shadow-sm shadow-gold-500/10"
            >
              Buy Now
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="w-full h-8 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all active:scale-95 shadow-sm shadow-gray-900/10 flex items-center justify-center gap-1"
              aria-label={`Add ${product.name || 'product'} to cart`}
            >
              <ShoppingCart className="w-2.5 h-2.5" />
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">Add</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
