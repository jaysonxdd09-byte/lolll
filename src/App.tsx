/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Triggering fresh build...
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, products as initialProducts } from './data/products';
import { mergeStorefrontProducts } from './lib/adminProducts';
import { loadCollection } from './lib/contentStore';
import { Sparkles, ArrowRight, Percent, Truck, X, Check, Copy } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import Certificates from './components/Certificates';
import CertificatesPage from './components/CertificatesPage';
import SearchResultsPage from './components/SearchResultsPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import BrandSection from './components/BrandSection';
import CartSidebar from './components/CartSidebar';
import SloganMarquee from './components/SloganMarquee';
import PresenceSection from './components/PresenceSection';
import DistributorInquirySection from './components/DistributorInquirySection';
import BlogsSection, { BlogPost } from './components/BlogsSection';
import { pb } from './lib/pbClient';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogsPage from './components/BlogsPage';
import BlogDetailsPage from './components/BlogDetailsPage';
import FAQ from './components/FAQ';
import Preloader from './components/Preloader';
import CheckoutForm, { ShippingDetails } from './components/CheckoutForm';

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'home' | 'certificates' | 'search' | 'product-details' | 'admin' | 'wishlist' | 'blogs' | 'blog-details' | 'faq'>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<Product | null>(null);
  const [savedProducts, setSavedProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem('test_one_saved_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'customer' | 'staff' | 'admin'>(() => {
    // Hydrate from cache for immediate UI responsiveness on reload
    return (localStorage.getItem('test_one_user_role') as any) || 'customer';
  });
  const [dbProducts, setDbProducts] = useState<Product[]>(() => mergeStorefrontProducts([]));
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Suggest Test One Alternatives & Promo Popups
  const [alternativeModal, setAlternativeModal] = useState<{
    isOpen: boolean;
    originalProduct: Product | null;
    suggestedProduct: Product | null;
    isBuyNowFlow: boolean;
  }>({
    isOpen: false,
    originalProduct: null,
    suggestedProduct: null,
    isBuyNowFlow: false
  });
  const [promoOpen, setPromoOpen] = useState(false);
  const [hasCopiedPromo, setHasCopiedPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(false);

  // Constants for admin emails
  const ADMIN_EMAILS = ['aither200929@gmail.com', 'maahi911111@gmail.com'];
  const STARTUP_LOADER_MS = 1500;
  const PROMO_AUTO_CLOSE_MS = 2000;

  // Helper to determine role
  const getRoleForUser = async (u: any): Promise<'customer' | 'staff' | 'admin'> => {
    if (!u) return 'customer';
    if (ADMIN_EMAILS.includes(u.email?.toLowerCase())) return 'admin';
    
    try {
      return (u.role as any) || 'customer';
    } catch (err) {
      console.error('Error fetching role:', err);
      return 'customer';
    }
  };

  const refreshProducts = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    try {
      const pData = await loadCollection<Product>('products', {
        column: 'created_at',
        ascending: false,
      });
      setDbProducts(mergeStorefrontProducts(pData));
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('test_one_saved_products', JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    const startupLoaderId = setTimeout(() => {
      setIsLoading(false);
      setIsAuthLoading(false);
    }, STARTUP_LOADER_MS);

    const fetchData = async () => {
      try {
        console.log('fetchData: starting');
        setIsLoading(true);
        const dataTimeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 6000);

        await refreshProducts({ silent: true });

        console.log('fetchData: fetching slides');
        try {
          const sData = await pb.collection('hero_slides').getFullList({
            sort: 'order_index'
          });
          setHeroSlides(sData);
        } catch (sError) {
          console.error('Error fetching slides:', sError);
        }

        clearTimeout(dataTimeoutId);
        console.log('fetchData: complete');
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // 1. Initial Session Check
    const initAuth = async () => {
      try {
        console.log('initAuth: starting');
        setIsAuthLoading(true);
        
        if (pb.authStore.isValid && pb.authStore.model) {
          const currentUser = pb.authStore.model;
          console.log('initAuth: session found', currentUser.email);
          setUser(currentUser);
          const role = await getRoleForUser(currentUser);
          setUserRole(role);
          localStorage.setItem('test_one_user_role', role);
          localStorage.setItem('test_one_user_email', currentUser.email || '');
        } else {
          console.log('initAuth: no session found');
          setUser(null);
          setUserRole('customer');
          localStorage.removeItem('test_one_user_role');
          localStorage.removeItem('test_one_user_email');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        console.log('initAuth: finishing');
        setIsAuthLoading(false);
      }
    };
    
    // Add a failsafe timeout for auth initialization
    const authTimeoutId = setTimeout(() => {
      if (isAuthLoading) {
        console.warn('initAuth: timeout reached, forcing isAuthLoading to false');
        setIsAuthLoading(false);
      }
    }, 6000);

    initAuth();

    // Global failsafe: Force both loading states to false after 10 seconds no matter what
    const globalTimeoutId = setTimeout(() => {
      if (isLoading || isAuthLoading) {
        console.warn('Global loading timeout reached: forcing all loaders to false');
        setIsLoading(false);
        setIsAuthLoading(false);
      }
    }, 10000);

    const unsubscribeAuth = pb.authStore.onChange(async (token, model) => {
      console.log('Auth state change:', model?.email);
      const currentUser = model ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const role = await getRoleForUser(currentUser);
        setUserRole(role);
        localStorage.setItem('test_one_user_role', role);
        localStorage.setItem('test_one_user_email', currentUser.email || '');
      } else {
        setUserRole('customer');
        localStorage.removeItem('test_one_user_role');
        localStorage.removeItem('test_one_user_email');
        setView('home');
      }
    });

    pb.collection('products').subscribe('*', () => {
      console.log('Realtime update: products changed');
      fetchData();
    }).catch(err => console.error('Realtime products sub failed:', err));

    pb.collection('hero_slides').subscribe('*', () => {
      console.log('Realtime update: hero_slides changed');
      fetchData();
    }).catch(err => console.error('Realtime hero_slides sub failed:', err));

    pb.collection('orders').subscribe('*', () => {
      console.log('Realtime update: orders changed');
      window.dispatchEvent(new CustomEvent('orders-updated'));
    }).catch(err => console.error('Realtime orders sub failed:', err));

    const handleCustomViewChange = (e: any) => {
      handleViewChange(e.detail);
    };
    window.addEventListener('change-view', handleCustomViewChange);

    const handleCatalogUpdated = () => {
      console.log('catalog-updated: refreshing products');
      refreshProducts({ silent: true });
    };
    window.addEventListener('catalog-updated', handleCatalogUpdated);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'testone:product_overrides' || e.key === 'testone:products') {
        refreshProducts({ silent: true });
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribeAuth();
      pb.collection('products').unsubscribe('*').catch(() => {});
      pb.collection('hero_slides').unsubscribe('*').catch(() => {});
      pb.collection('orders').unsubscribe('*').catch(() => {});
      window.removeEventListener('change-view', handleCustomViewChange);
      window.removeEventListener('catalog-updated', handleCatalogUpdated);
      window.removeEventListener('storage', handleStorage);
      clearTimeout(startupLoaderId);
      clearTimeout(authTimeoutId);
      clearTimeout(globalTimeoutId);
    };
  }, [refreshProducts]);

  const handleViewChange = (newView: 'home' | 'certificates' | 'search' | 'product-details' | 'admin' | 'wishlist' | 'blogs' | 'blog-details') => {
    if (newView === 'home' || newView === 'search' || newView === 'product-details') {
      refreshProducts({ silent: true });
    }
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('All');
    handleViewChange('search');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await pb.collection('products').delete(id);
      } catch (err: any) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleProductClick = (product: any) => {
    const latest = dbProducts.find((p) => p.id === product.id) ?? product;
    setSelectedProduct(latest);
    setView('product-details');
    window.scrollTo(0, 0);
  };

  const handleBlogClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
    handleViewChange('blog-details');
  };

  // Helper to map competitor product to Test One alternative
  const getTestOneAlternative = (product: Product): Product | null => {
    if (!product || product.brand === 'Test One') return null;
    
    // Find all Test One products
    const alternatives = initialProducts.filter(p => p.brand === 'Test One');
    if (alternatives.length === 0) return null;
    
    // 1. Check direct category name matches
    const categoryMatch = alternatives.find(p => 
      p.category.toLowerCase().includes(product.category.toLowerCase()) || 
      product.category.toLowerCase().includes(p.category.toLowerCase())
    );
    if (categoryMatch) return categoryMatch;
    
    // 2. Specific matching based on competitor keywords
    const name = product.name.toLowerCase();
    if (name.includes('catheter') || name.includes('urine') || name.includes('ostomy') || name.includes('bag') || name.includes('drainage')) {
      return alternatives.find(p => p.name.includes('Delivery Drape Kit')) || alternatives[0];
    }
    if (name.includes('scissors') || name.includes('scalpel') || name.includes('retraction') || name.includes('instrument')) {
      return alternatives.find(p => p.name === 'Cling Drape') || alternatives[0];
    }
    if (name.includes('tape') || name.includes('gauze') || name.includes('dressing') || name.includes('bandage') || name.includes('wound') || name.includes('swabs')) {
      return alternatives.find(p => p.name.includes('Microporous Paper Tape 1 inch')) || alternatives[0];
    }
    if (name.includes('gown') || name.includes('glove') || name.includes('mask') || name.includes('wear') || name.includes('apron')) {
      return alternatives.find(p => p.name.includes('Full Gown')) || alternatives[0];
    }
    
    // 3. General default recommendation
    return alternatives.find(p => p.name.includes('Ceaserian Drape Kit')) || alternatives[0];
  };

  // Promo: show after startup loader, auto-close after 2 seconds
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('test_one_promo_seen');
    if (hasSeen) return;

    const openTimer = setTimeout(() => setPromoOpen(true), STARTUP_LOADER_MS);
    return () => clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!promoOpen) return;

    const closeTimer = setTimeout(() => {
      setPromoOpen(false);
      sessionStorage.setItem('test_one_promo_seen', 'true');
    }, PROMO_AUTO_CLOSE_MS);

    return () => clearTimeout(closeTimer);
  }, [promoOpen]);

  const addToCart = (product: any) => {
    const alternative = getTestOneAlternative(product);
    if (alternative) {
      setAlternativeModal({
        isOpen: true,
        originalProduct: product,
        suggestedProduct: alternative,
        isBuyNowFlow: false
      });
    } else {
      setCart((prev) => [...prev, product]);
    }
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleBuyNow = (product: any) => {
    const alternative = getTestOneAlternative(product);
    if (alternative) {
      setAlternativeModal({
        isOpen: true,
        originalProduct: product,
        suggestedProduct: alternative,
        isBuyNowFlow: true
      });
    } else {
      setCheckoutItem(product);
      setIsCheckoutOpen(true);
    }
  };

  const handleCheckoutSubmit = async (details: ShippingDetails) => {
    if (!checkoutItem) return;

    try {
      // 1. Create order in PocketBase
      const fullAddress = `${details.address}, ${details.city}, ${details.state} - ${details.pincode}`;
      const orderData = await pb.collection('orders').create({
        user_id: user?.id || null,
        customer_name: details.fullName,
        email: user?.email || "guest@testone.com",
        total_amount: checkoutItem.price,
        status: 'Pending',
        shipping_address: fullAddress,
        phone: details.phone
      });

      // 2. Open Razorpay
      const amount = (checkoutItem.price || 500) * 100; // in paisa
      
      const options = {
        key: "rzp_test_YOUR_KEY_HERE", 
        amount: amount,
        currency: "INR",
        name: "Test One Medical",
        description: `Purchase ${checkoutItem.name}`,
        image: "/images/logo/logo.png",
        handler: async function (response: any) {
          // Update order status on success
          await pb.collection('orders').update(orderData.id, { status: 'Paid', payment_id: response.razorpay_payment_id });
          alert("Payment Successful! Order ID: " + orderData.id);
          setIsCheckoutOpen(false);
          setCheckoutItem(null);
        },
        prefill: {
          name: details.fullName,
          email: user?.email || "",
          contact: details.phone
        },
        theme: {
          color: "#B8860B",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Failed to place order: ' + err.message);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    if (delta > 0) {
      const product = cart.find(p => p.id === productId);
      if (product) setCart(prev => [...prev, product]);
    } else {
      removeFromCart(productId);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gold-100 selection:text-gold-800">
      <Preloader isLoading={isLoading || isAuthLoading} />
      
      <CheckoutForm 
        isOpen={isCheckoutOpen} 
        onClose={() => { setIsCheckoutOpen(false); setCheckoutItem(null); }}
        onSubmit={handleCheckoutSubmit}
        totalAmount={checkoutItem?.price || 0}
      />

      <Navbar 
        cartCount={cart.length} 
        savedCount={savedProducts.length}
        onCategorySelect={(cat) => { setSelectedCategory(cat); handleViewChange('search'); }} 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onViewChange={handleViewChange}
        currentView={view === 'certificates' ? 'certificates' : view === 'wishlist' ? 'wishlist' : view === 'blogs' ? 'blogs' : view === 'faq' ? 'faq' : 'home'}
        onCartToggle={() => setIsCartOpen(true)}
        user={user}
        userRole={userRole}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={(id) => setCart(prev => prev.filter(p => p.id !== id))}
        onUpdateQuantity={updateCartQuantity}
        user={user}
        onCheckoutComplete={() => {
          setCart([]);
          setIsCartOpen(false);
          alert('Order placed successfully!');
        }}
      />
      
      <main>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : view === 'admin' ? (
          <AdminDashboard user={user} userRole={userRole} />
        ) : view === 'home' ? (
          <>
            <Hero slides={heroSlides.length > 0 ? heroSlides : undefined} onExplore={() => { setSelectedCategory('All'); setSearchQuery(''); handleViewChange('search'); }} />
            
            <SloganMarquee />
            
            <BrandSection onBrandClick={(brand) => {
              setSearchQuery(brand);
              setSelectedCategory('All');
              handleViewChange('search');
            }} />

            {/* Global Catalog Section */}
            <section id="catalog" className="py-12 sm:py-16 bg-gray-50/50">
              <div className="max-w-[95%] mx-auto px-4 sm:px-8">
                <div className="text-center mb-12 sm:mb-20 max-w-2xl mx-auto">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-4 block">Product Catalog</span>
                  <h2 className="text-2xl sm:text-4xl font-serif text-gray-900 mb-6">Our Full Range of Medical Excellence</h2>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                    {['All', 'Instruments', 'Diagnostic', 'Wound Care', 'Surgical Wear'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); handleViewChange('search'); }}
                        className={`px-4 sm:px-6 py-2 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedCategory === cat 
                            ? 'bg-gold-500 text-white shadow-xl shadow-gold-500/20' 
                            : 'bg-white text-gray-500 border border-gray-100 hover:border-gold-300 hover:text-gold-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                  <AnimatePresence mode="popLayout">
                    {dbProducts.slice(0, 10).map((product) => (
                      <motion.div 
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer"
                      >
                        <ProductCard 
                          product={product} 
                          onAddToCart={addToCart} 
                          isSaved={savedProducts.includes(product.id)}
                          onToggleSave={toggleSaveProduct}
                          onBuyNow={handleBuyNow}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </section>

            {/* Most Popular */}
            <section className="pb-16 sm:pb-24 bg-white border-t border-gray-100 pt-16 sm:pt-24">
              <div className="max-w-[95%] mx-auto px-4 sm:px-8">
                <div className="flex items-end justify-between mb-8 sm:mb-12">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-4 block">Institutional Choice</span>
                    <h2 className="text-2xl sm:text-4xl font-serif text-gray-900">Most <span className="text-gold-600">Popular</span></h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
                  {dbProducts.filter(p => p.rating >= 4.8).slice(0, 5).map((product) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      onClick={() => handleProductClick(product)}
                      className="cursor-pointer"
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={addToCart} 
                        isSaved={savedProducts.includes(product.id)}
                        onToggleSave={toggleSaveProduct}
                        onBuyNow={handleBuyNow}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <PresenceSection />
            <DistributorInquirySection />
            <BlogsSection onBlogClick={handleBlogClick} onViewAll={() => handleViewChange('blogs')} />
            <Certificates onViewDocuments={() => handleViewChange('certificates')} />
          </>
        ) : view === 'certificates' ? (
          <CertificatesPage onBack={() => handleViewChange('home')} />
        ) : view === 'wishlist' ? (
          <SearchResultsPage 
            query=""
            category="Saved Items"
            onAddToCart={addToCart}
            onProductClick={handleProductClick}
            onBack={() => handleViewChange('home')}
            allProducts={dbProducts.filter(p => savedProducts.includes(p.id))}
            isWishlist={true}
            savedProducts={savedProducts}
            onToggleSave={toggleSaveProduct}
            onBuyNow={handleBuyNow}
          />
        ) : view === 'product-details' && selectedProduct ? (
          <ProductDetailsPage 
            product={dbProducts.find((p) => p.id === selectedProduct.id) ?? selectedProduct} 
            onBack={() => handleViewChange('search')} 
            onAddToCart={(p, q) => {
              for(let i=0; i<q; i++) addToCart(p);
            }}
            allProducts={dbProducts}
            onProductClick={handleProductClick}
            onSave={() => toggleSaveProduct(selectedProduct.id)}
            isSaved={savedProducts.includes(selectedProduct.id)}
            onBuyNow={handleBuyNow}
          />
        ) : view === 'blogs' ? (
          <BlogsPage onBack={() => handleViewChange('home')} onBlogClick={handleBlogClick} />
        ) : view === 'blog-details' && selectedBlog ? (
          <BlogDetailsPage blog={selectedBlog} onBack={() => handleViewChange('blogs')} />
        ) : view === 'faq' ? (
          <div className="pt-16 sm:pt-24">
            <FAQ />
            <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
              <button onClick={() => handleViewChange('home')} className="bg-gray-900 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-600 transition-all">Back to Home</button>
            </div>
          </div>
        ) : (
          <SearchResultsPage 
            query={searchQuery}
            category={selectedCategory}
            onAddToCart={addToCart}
            onProductClick={handleProductClick}
            onBack={() => handleViewChange('home')}
            allProducts={dbProducts}
            savedProducts={savedProducts}
            onToggleSave={toggleSaveProduct}
            onBuyNow={handleBuyNow}
          />
        )}
      </main>

      <Footer />

      {/* Test One Alternative Suggestion Modal */}
      <AnimatePresence>
        {alternativeModal.isOpen && alternativeModal.originalProduct && alternativeModal.suggestedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden border border-gold-500/30 max-w-2xl w-full shadow-[0_24px_50px_-12px_rgba(184,134,11,0.25)] relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setAlternativeModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>

              {/* Glowing header banner */}
              <div className="bg-gradient-to-r from-gold-600 via-amber-500 to-gold-600 px-6 py-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-gold-100 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-serif font-bold">Smart Alternative Recommendation</h3>
                <p className="text-xs text-gold-100/90 mt-1 uppercase tracking-widest font-semibold">Choose Test One & Save Institutional Cost</p>
              </div>

              {/* Grid content */}
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-sm text-gray-500 text-center">
                  You added a competing brand item. Switch to <strong>Test One Medical</strong> alternative for premium quality and massive cost savings!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {/* Original Competing Product */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60 flex flex-col justify-between">
                    <div>
                      <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-2 inline-block">
                        Original Brand ({alternativeModal.originalProduct.brand || 'Competitor'})
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">{alternativeModal.originalProduct.name}</h4>
                      {alternativeModal.originalProduct.code && (
                        <p className="text-[10px] font-mono text-gray-400">Code: {alternativeModal.originalProduct.code}</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200/60">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Price</p>
                      <p className="text-lg font-bold text-gray-600">₹{alternativeModal.originalProduct.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Absolute "VS" badge */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold-500 text-white font-black text-[10px] items-center justify-center border-4 border-white shadow-md z-10">
                    VS
                  </div>

                  {/* Recommended Test One Product */}
                  <div className="bg-gradient-to-br from-gold-50/70 to-white rounded-2xl p-4 border-2 border-gold-500 flex flex-col justify-between shadow-sm relative">
                    <div className="absolute top-2 right-2 bg-gold-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Save {Math.round(((alternativeModal.originalProduct.price - alternativeModal.suggestedProduct.price) / alternativeModal.originalProduct.price) * 100)}%
                    </div>
                    <div>
                      <span className="bg-gold-500 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-2 inline-block">
                        Recommended Test One Alternative
                      </span>
                      <h4 className="font-bold text-gold-950 text-sm mb-1 leading-snug">{alternativeModal.suggestedProduct.name}</h4>
                      <p className="text-[10px] font-mono text-gold-600 font-medium">Code: {alternativeModal.suggestedProduct.code || 'XP-TEST'}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gold-200/50">
                      <p className="text-[10px] text-gold-600 uppercase tracking-wider font-semibold">Special Rate</p>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <p className="text-xl font-black text-gold-600">₹{alternativeModal.suggestedProduct.price.toLocaleString('en-IN')}</p>
                        {alternativeModal.suggestedProduct.mrp && (
                          <p className="text-xs text-gray-400 line-through">₹{alternativeModal.suggestedProduct.mrp.toLocaleString('en-IN')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (alternativeModal.isBuyNowFlow) {
                        setCheckoutItem(alternativeModal.suggestedProduct);
                        setIsCheckoutOpen(true);
                      } else {
                        setCart(prev => [...prev, alternativeModal.suggestedProduct!]);
                        alert(`Successfully added premium alternative: ${alternativeModal.suggestedProduct?.name}`);
                      }
                      setAlternativeModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    className="flex-1 bg-gold-600 text-white hover:bg-gold-700 font-bold uppercase tracking-widest text-[10px] sm:text-xs py-4 px-6 rounded-xl shadow-lg shadow-gold-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Switch to Test One & Save ₹{(alternativeModal.originalProduct.price - alternativeModal.suggestedProduct.price).toLocaleString('en-IN')}
                  </button>
                  <button
                    onClick={() => {
                      if (alternativeModal.isBuyNowFlow) {
                        setCheckoutItem(alternativeModal.originalProduct);
                        setIsCheckoutOpen(true);
                      } else {
                        setCart(prev => [...prev, alternativeModal.originalProduct!]);
                      }
                      setAlternativeModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs py-4 px-6 rounded-xl transition-all active:scale-95 text-center"
                  >
                    No, keep {alternativeModal.originalProduct.brand}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Starting Page Launch Promo Popup */}
      <AnimatePresence>
        {promoOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl overflow-hidden border border-gold-500/30 max-w-md w-full shadow-[0_24px_50px_-12px_rgba(0,0,0,0.3)] relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setPromoOpen(false);
                  sessionStorage.setItem('test_one_promo_seen', 'true');
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>

              {/* Header Image/Background */}
              <div className="h-44 bg-gradient-to-br from-gold-700 via-gold-500 to-amber-600 flex items-center justify-center relative overflow-hidden text-center text-white px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
                    <Sparkles className="w-6 h-6 text-gold-100 animate-pulse" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black tracking-wide">Test One Solutions</h3>
                  <p className="text-[10px] text-gold-100 uppercase tracking-[0.25em] font-semibold mt-1">Exclusive Inaugural Offer</p>
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-6 sm:p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-gray-900">Get Flat 20% OFF or Free Delivery!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed px-2">
                    Enjoy premium medical equipment with <strong>Free Delivery on all orders up to ₹1,000</strong> or get an extra <strong>20% OFF</strong> on your very first order!
                  </p>
                </div>

                {/* Offer Coupon Card */}
                <div className="bg-gradient-to-r from-gold-50 to-amber-50/50 rounded-2xl p-4 border border-gold-200/60 relative overflow-hidden group">
                  <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gold-200/20" />
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-gold-200/20" />
                  
                  <p className="text-[9px] font-bold text-gold-600 uppercase tracking-widest mb-1.5">Your Celebration Code</p>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono font-black text-lg tracking-wider text-gold-950 bg-white border border-gold-300/80 px-4 py-1.5 rounded-lg shadow-sm">
                      TESTONE20
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('TESTONE20');
                        setHasCopiedPromo(true);
                        setTimeout(() => setHasCopiedPromo(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-gold-600 text-white hover:bg-gold-700 transition-colors shadow-sm"
                      title="Copy promo code"
                    >
                      {hasCopiedPromo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[9.5px] text-gold-700/80 mt-2 font-medium">
                    {hasCopiedPromo ? 'Code copied to clipboard!' : 'Click the button to copy and apply code at checkout.'}
                  </p>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => {
                    setPromoOpen(false);
                    setAppliedPromo(true);
                    sessionStorage.setItem('test_one_promo_seen', 'true');
                    alert("Coupon code 'TESTONE20' has been successfully applied to your session! 🌟 Enjoy 20% discount or free delivery.");
                  }}
                  className="w-full bg-gray-900 text-white hover:bg-gold-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs py-4 px-6 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Claim 20% Offer Now
                </button>

                <button
                  onClick={() => {
                    setPromoOpen(false);
                    sessionStorage.setItem('test_one_promo_seen', 'true');
                  }}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider transition-colors block mx-auto animate-pulse"
                >
                  Maybe Later, Keep Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
