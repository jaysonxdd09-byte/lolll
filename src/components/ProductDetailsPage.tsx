import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Zap, ShieldCheck, Truck, RefreshCcw, Star, Plus, Minus, ChevronRight, CheckCircle2, Package, Heart, MessageCircle } from 'lucide-react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  allProducts?: Product[];
  onProductClick?: (product: Product) => void;
  isSaved?: boolean;
  onSave?: () => void;
  onBuyNow?: (product: Product) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  product, 
  onBack, 
  onAddToCart, 
  allProducts = [], 
  onProductClick,
  isSaved = false,
  onSave,
  onBuyNow
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');
  const stock = Number(product.stock_quantity ?? 0);
  const outOfStock = stock <= 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Related products: same category, exclude current
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  // Also get "you may also like" from other categories
  const alsoLike = allProducts.filter(p => p.category !== product.category && p.id !== product.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Catalog</span>
          </button>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Store</span><ChevronRight className="w-3 h-3" /><span>{product.category}</span><ChevronRight className="w-3 h-3" /><span className="text-gray-900">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left: Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 sticky top-20 sm:top-24 lg:top-32 self-start z-10">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white relative group border border-gray-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=800'; }} />
              <div className="absolute top-4 left-4">
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-5 space-y-6">
            {/* Title & Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-gold-50 text-gold-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">{product?.brand || 'Premium'}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < Math.floor(product?.rating || 0) ? 'fill-current' : 'text-gray-200'}`} />))}
                  <span className="text-[10px] font-bold text-gray-400 ml-1">({product?.reviews || 0})</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-4xl font-serif text-gray-900 leading-tight">{product?.name || 'Untitled Product'}</h1>
                <button 
                  onClick={(e) => { e.stopPropagation(); onSave?.(); }}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSaved 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'bg-white text-gray-400 hover:text-red-500 border border-gray-100 shadow-sm'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-light text-gray-900">${(product?.price || 0).toFixed(2)}</span>
                <span className="text-gray-400 text-sm line-through mb-0.5">${((product?.price || 0) * 1.2).toFixed(2)}</span>
                <span className="text-emerald-500 text-xs font-bold mb-0.5">20% OFF</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${outOfStock ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${outOfStock ? 'bg-red-100 text-red-500' : 'bg-gold-50 text-gold-500'}`}><Package className="w-4 h-4" /></div>
                <div><div className="text-[9px] font-bold text-gray-400 uppercase">{outOfStock ? 'Availability' : 'In Stock'}</div><div className={`text-xs font-bold ${outOfStock ? 'text-red-600' : 'text-gray-900'}`}>{outOfStock ? 'Out of Stock' : `Ready to Ship (${stock} units)`}</div></div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500"><Truck className="w-4 h-4" /></div>
                <div><div className="text-[9px] font-bold text-gray-400 uppercase">Delivery</div><div className="text-xs font-bold text-gray-900">Free Express</div></div>
              </div>
            </div>

            {/* Quantity & CTAs */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Quantity</span>
                <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <button onClick={() => handleQuantityChange(-1)} disabled={outOfStock} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-gold-600 transition-colors disabled:opacity-50"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={outOfStock} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-gold-600 transition-colors disabled:opacity-50"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {outOfStock ? (
                  <div className="flex-1 bg-red-50 text-red-600 border border-red-100 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-center shadow-sm">
                    Temporarily Out of Stock
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => onAddToCart(product, quantity)} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </button>
                      <button onClick={() => onBuyNow?.(product)} className="flex-1 bg-gold-500 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" /> Buy Now
                      </button>
                    </div>
                  </>
                )}
                <button 
                  onClick={() => {
                    const message = `Hello, I'm interested in a bulk order for ${product.name} (ID: ${product.id}). Could you please provide a quote for institutional supply?`;
                    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full bg-emerald-50 text-emerald-700 border border-emerald-100 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Bulk Order Inquiry (WhatsApp)
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex gap-6 border-b border-gray-100">
                {(['description', 'specifications', 'shipping'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-gold-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tab}
                    {activeTab === tab && (<motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />)}
                  </button>
                ))}
              </div>
              <div className="min-h-[60px] text-gray-500 text-sm leading-relaxed font-light">
                {activeTab === 'description' && (
                  <div>
                    <p className="mb-3">This premium {product.name} is engineered for clinical precision and institutional durability. Manufactured under strict ISO 13485 standards.</p>
                    <ul className="space-y-3 mt-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                        </div>
                        <span className="text-gray-600">High-grade medical materials</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                        </div>
                        <span className="text-gray-600">Ergonomic design for extended use</span>
                      </li>
                    </ul>
                  </div>
                )}
                {activeTab === 'specifications' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-50"><span className="font-bold text-gray-400">Material</span><span className="text-gray-900">Hospital Grade Polymer</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-50"><span className="font-bold text-gray-400">Sterility</span><span className="text-gray-900">Gamma Irradiated</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-50"><span className="font-bold text-gray-400">Compliance</span><span className="text-gray-900">ISO, CE, FDA</span></div>
                  </div>
                )}
                {activeTab === 'shipping' && (<p>Standard delivery within 2-4 business days. Expedited shipping available for institutional partners.</p>)}
              </div>
            </div>

            {/* Quality Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="w-5 h-5" /><span className="text-[10px] font-bold uppercase tracking-widest">2 Year Warranty</span></div>
              <div className="flex items-center gap-2 text-gray-400"><RefreshCcw className="w-5 h-5" /><span className="text-[10px] font-bold uppercase tracking-widest">30 Day Returns</span></div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-2 block">Similar Products</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900">Related <span className="text-gold-600">Items</span></h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onClick={() => onProductClick?.(p)} className="cursor-pointer">
                  <ProductCard product={p} onAddToCart={() => onAddToCart(p, 1)} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* You May Also Like */}
        {alsoLike.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-2 block">Recommended</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900">You May <span className="text-gold-600">Also Like</span></h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {alsoLike.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onClick={() => onProductClick?.(p)} className="cursor-pointer">
                  <ProductCard product={p} onAddToCart={() => onAddToCart(p, 1)} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
