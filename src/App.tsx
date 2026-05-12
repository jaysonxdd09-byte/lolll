/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Triggering fresh build...
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from './data/products';
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
import { supabase } from './lib/supabaseClient';
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
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('test_one_saved_products', JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('fetchData: starting');
        setIsLoading(true);
        // Add a failsafe timeout for data fetching
        const dataTimeoutId = setTimeout(() => {
          if (isLoading) {
            console.warn('fetchData: timeout reached, forcing isLoading to false');
            setIsLoading(false);
          }
        }, 6000);

        // Fetch Products
        console.log('fetchData: fetching products');
        const { data: pData, error: pError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (pError) console.error('Error fetching products:', pError);
        if (pData) setDbProducts(pData);
        
        // Fetch Hero Slides
        console.log('fetchData: fetching slides');
        const { data: sData, error: sError } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
        if (sError) console.error('Error fetching slides:', sError);
        if (sData) setHeroSlides(sData);

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
        setIsAuthLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // Immediate role check
          if (session.user.email?.toLowerCase() === 'aither200929@gmail.com') {
            setUserRole('admin');
          } else {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile) setUserRole(profile.role);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
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

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (session.user.email?.toLowerCase() === 'aither200929@gmail.com') {
          setUserRole('admin');
        } else {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
          if (profile) setUserRole(profile.role);
        }
      } else {
        setUserRole('customer');
        if (event === 'SIGNED_OUT') {
          setView('home');
        }
      }
    });

    // Realtime Subscriptions for live updates
    const productsChannel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        console.log('Realtime update: products changed');
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, () => {
        console.log('Realtime update: hero_slides changed');
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        console.log('Realtime update: orders changed');
        // Custom event to notify AdminDashboard if it's open
        window.dispatchEvent(new CustomEvent('orders-updated'));
      })
      .subscribe();

    const handleCustomViewChange = (e: any) => {
      handleViewChange(e.detail);
    };
    window.addEventListener('change-view', handleCustomViewChange);

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(productsChannel);
      window.removeEventListener('change-view', handleCustomViewChange);
      clearTimeout(authTimeoutId);
      clearTimeout(globalTimeoutId);
    };
  }, []);

  const handleViewChange = (newView: 'home' | 'certificates' | 'search' | 'product-details' | 'admin' | 'wishlist' | 'blogs' | 'blog-details') => {
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
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        // Assuming fetchProducts logic is integrated into parent scope or global data state
      } catch (err: any) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    handleViewChange('product-details');
  };

  const handleBlogClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
    handleViewChange('blog-details');
  };

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleBuyNow = (product: any) => {
    setCheckoutItem(product);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (details: ShippingDetails) => {
    if (!checkoutItem) return;

    try {
      // 1. Create order in Supabase
      const fullAddress = `${details.address}, ${details.city}, ${details.state} - ${details.pincode}`;
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          customer_name: details.fullName,
          email: user?.email || "guest@testone.com",
          total_amount: checkoutItem.price,
          status: 'Pending',
          shipping_address: fullAddress,
          phone: details.phone
        })
        .select()
        .single();

      if (orderError) throw orderError;

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
          await supabase.from('orders').update({ status: 'Paid', payment_id: response.razorpay_payment_id }).eq('id', orderData.id);
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
            product={selectedProduct} 
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
    </div>
  );
}
