import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, Search, ChevronRight, ChevronDown, MessageCircle, Award, LogOut, LayoutDashboard, Settings, Heart } from 'lucide-react';
import { products } from '../data/products';
import AuthModal from './AuthModal';
import { supabase } from '../lib/supabaseClient';

interface NavbarProps {
  cartCount: number;
  savedCount?: number;
  onCategorySelect?: (category: string) => void;
  onViewChange?: (view: 'home' | 'certificates' | 'admin' | 'search' | 'product-details' | 'wishlist' | 'blogs' | 'faq') => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  currentView?: 'home' | 'certificates' | 'admin' | 'search' | 'product-details' | 'wishlist' | 'blogs' | 'faq';
  onCartToggle?: () => void;
  user?: any;
  userRole?: 'customer' | 'staff' | 'admin';
}

export default function Navbar({ cartCount, savedCount = 0, onCategorySelect, onViewChange, onSearch, searchQuery = '', currentView, onCartToggle, user, userRole }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node) && !mobileSearchRef.current) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
    setIsSearchOpen(e.target.value.trim().length > 0);
  };

  const handleSuggestionClick = (name: string) => {
    onSearch?.(name);
    setIsSearchOpen(false);
  };

  const handleSignOut = () => {
    try {
      supabase.auth.signOut().catch(console.error);
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (err) {
      window.location.href = '/';
    }
  };

  const goToSection = (id: string) => {
    if (currentView !== 'home') {
      onViewChange?.('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="max-w-[95%] mx-auto px-4 sm:px-8 bg-white">
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 h-16 sm:h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 cursor-pointer group" onClick={() => onViewChange?.('home')}>
            <div className="h-12 sm:h-20 lg:h-24 w-auto flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img src="/images/logo/logo.png" alt="TEST ONE" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 leading-none">
                TEST <span className="text-gold-500">ONE</span>
              </span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gray-400 mt-1">Medical Solutions</span>
            </div>
          </div>

          {/* Inline nav — Home, About, Presence, Brands (between logo & search, md+) */}
          <div className="hidden md:flex items-center gap-x-2 lg:gap-x-3 flex-shrink-0">
            {[
              { label: 'Home', action: () => onViewChange?.('home') },
              { label: 'About Us', action: () => goToSection('about') },
              { label: 'Presence', action: () => goToSection('presence') },
              { label: 'Brands', action: () => goToSection('brands') },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.action()}
                className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-[10px] lg:text-[11px] font-extrabold uppercase tracking-widest text-gray-700 hover:text-gold-700 hover:bg-gold-50 hover:border-gold-200 border-2 border-gray-50 bg-white transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mid Section - Search Bar */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-2xl px-2 lg:px-6" ref={searchRef}>
            <div className="relative w-full flex items-center bg-white border-2 border-gray-100 rounded-xl focus-within:border-gold-500 transition-all shadow-sm">
              <div className="relative group/cat">
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-r border-gray-100 rounded-l-xl hover:bg-gray-100 transition-colors">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight whitespace-nowrap">All</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Test One"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => { if (searchQuery.trim().length > 0) setIsSearchOpen(true); }}
                  className="w-full bg-transparent border-none text-sm px-6 py-3 focus:ring-0 outline-none placeholder:text-gray-400 text-gray-900"
                />
                {isSearchOpen && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[100]">
                    <div className="py-2">
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map((p) => (
                        <button key={p.id} onClick={() => handleSuggestionClick(p.name)} className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gold-50/50 transition-colors text-left group">
                          <Search className="w-4 h-4 text-gray-300 group-hover:text-gold-500" />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{p.name}</span>
                            <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-tight">in {p.category}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="px-6 py-8 text-center">
                          <Search className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">No matching products found</p>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Trending</span>
                      <div className="flex gap-3">
                        {['Scalpel', 'Gloves', 'Monitors'].map(t => (
                          <button key={t} onClick={() => handleSuggestionClick(t)} className="text-[9px] font-bold text-gold-600 hover:underline">#{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="bg-gold-500 hover:bg-gold-600 text-white p-3 rounded-r-xl transition-all shadow-lg shadow-gold-500/10" onClick={() => { onSearch?.(searchQuery); setIsSearchOpen(false); }}>
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-8 text-gray-700 ml-auto flex-shrink-0">
            {/* Auth - Desktop */}
            <div className="hidden lg:flex items-center gap-4 border-r border-gray-100 pr-8 mr-2">
              {(userRole === 'admin' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) && (
                <button 
                  onClick={() => onViewChange?.('admin')} 
                  className="hidden md:flex items-center gap-2 bg-gold-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-700 transition-all shadow-lg shadow-gold-500/20 border border-gold-500"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin Portal
                </button>
              )}
              {user ? (
                <div className="group relative py-2.5">
                  <button className="flex items-center gap-2 cursor-pointer">
                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center group-hover:border-gold-300 group-hover:bg-gold-50 transition-all">
                      <User className="w-4 h-4 text-gray-400 group-hover:text-gold-600 transition-colors" />
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Signed in as</p>
                      <p className="text-xs text-gray-900 truncate font-medium">{user.email}</p>
                    </div>
                    
                    <button className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-gray-600 hover:text-gold-600 hover:bg-gold-50/50 transition-colors flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" /> User Settings
                    </button>
                    
                    {(userRole === 'admin' || userRole === 'staff' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) && (
                      <button onClick={() => onViewChange?.('admin')} className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-gold-600 hover:text-gold-700 hover:bg-gold-50 transition-colors flex items-center gap-2 bg-gold-50/30">
                        <LayoutDashboard className="w-3.5 h-3.5" /> {(userRole === 'admin' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) ? 'Admin Portal' : 'Staff Portal'}
                      </button>
                    )}
                    
                    <div className="border-t border-gray-50 mt-2 pt-2">
                      <button onClick={handleSignOut} className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => setIsAuthModalOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gold-600 transition-colors">Sign In</button>
                  <button onClick={() => setIsAuthModalOpen(true)} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg shadow-gray-900/10">Create Account</button>
                </>
              )}
            </div>

            <button className="hidden sm:flex flex-col items-center gap-1 group">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-gold-500 transition-colors" />
            </button>

            <button className="relative flex flex-col items-center gap-1 group" onClick={onCartToggle}>
              <div className="relative">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-gold-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
                )}
              </div>
            </button>

            <button className="lg:hidden h-10 w-10 flex items-center justify-center -mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Categories Bar */}
      <div className="hidden lg:block bg-gold-50 border-t border-gold-100">
        <div className="max-w-[95%] mx-auto px-8 flex items-center justify-between py-1 relative">
          <div className="flex items-center gap-8">
            {[
              { name: 'Catheters & Drainages', subItems: ['External Catheters', 'Foley Catheters', 'Intermittent Catheters', 'Urine Bags', 'Drainage Trays'] },
              { name: 'Orthopaedic Products', subItems: ['Braces & Supports', 'Casting Supplies', 'Compression Stockings', 'Splints', 'Traction Equipment'] },
              { name: 'Ostomy Care', subItems: ['Bags & Pouches', 'Barriers & Wafers', 'Adhesive Removers', 'Belts', 'Skin Care'] },
              { name: 'Surgical Supplies', subItems: ['Gauze & Sponges', 'Surgical Tape', 'Drapes', 'Sutures', 'Gloves'] },
              { name: 'Syringes & Needles', subItems: ['Insulin Syringes', 'Standard Syringes', 'Safety Needles', 'Spinal Needles', 'Dispensing Needles'] },
              { name: 'Wound Care', subItems: ['Bandages', 'Dressing', 'Wound Cleansers', 'Antiseptics', 'Scar Treatments'] }
            ].map((item, idx) => (
              <div key={idx} className="group relative py-2.5">
                <button className="flex items-center gap-1 cursor-pointer whitespace-nowrap" onClick={() => onCategorySelect?.(item.name)}>
                  <span className="text-[11.5px] font-medium text-gray-700 group-hover:text-gold-600 transition-colors uppercase tracking-tight">{item.name}</span>
                  <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-gold-500 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-b-xl py-4 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex flex-col">
                    {item.subItems.map((sub, sIdx) => (
                      <button key={sIdx} className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-500 hover:text-gold-600 hover:bg-gold-50/50 transition-colors border-l-2 border-transparent hover:border-gold-400" onClick={() => onCategorySelect?.(item.name)}>{sub}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className={`flex items-center gap-2 group cursor-pointer whitespace-nowrap py-2.5 ${currentView === 'certificates' ? 'text-gold-600 border-b-2 border-gold-500' : ''}`} onClick={() => onViewChange?.('certificates')}>
              <Award className="h-4 w-4 text-gold-500" />
              <span className="text-[11.5px] font-bold text-gray-700 group-hover:text-gold-600 transition-colors uppercase tracking-tight">Certifications</span>
            </button>
            <button className={`flex items-center gap-2 group cursor-pointer whitespace-nowrap py-2.5 ${currentView === 'blogs' ? 'text-gold-600 border-b-2 border-gold-500' : ''}`} onClick={() => onViewChange?.('blogs')}>
              <span className="text-[11.5px] font-bold text-gray-700 group-hover:text-gold-600 transition-colors uppercase tracking-tight">Blogs</span>
            </button>
            <button className={`flex items-center gap-2 group cursor-pointer whitespace-nowrap py-2.5 ${currentView === 'wishlist' ? 'text-gold-600 border-b-2 border-gold-500' : ''}`} onClick={() => onViewChange?.('wishlist')}>
              <div className="relative">
                <Heart className={`h-4 w-4 ${currentView === 'wishlist' ? 'text-gold-600 fill-gold-600' : 'text-gray-400 group-hover:text-gold-600'}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">{savedCount}</span>
                )}
              </div>
              <span className="text-[11.5px] font-bold text-gray-700 group-hover:text-gold-600 transition-colors uppercase tracking-tight">Saved Items</span>
            </button>
            <button className={`flex items-center gap-2 group cursor-pointer whitespace-nowrap py-2.5 ${currentView === 'faq' ? 'text-gold-600 border-b-2 border-gold-500' : ''}`} onClick={() => onViewChange?.('faq')}>
              <span className="text-[11.5px] font-bold text-gray-700 group-hover:text-gold-600 transition-colors uppercase tracking-tight">FAQ</span>
            </button>
            <button className="flex items-center gap-2 group cursor-pointer whitespace-nowrap py-2.5" onClick={() => onCategorySelect?.('All')}>
              <span className="text-[11.5px] font-bold text-gray-700 group-hover:text-gold-600 transition-colors uppercase tracking-tight">View All</span>
              <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gold-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative" ref={mobileSearchRef}>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearchChange} className="flex-1 bg-transparent border-none text-sm px-4 py-3 focus:ring-0 outline-none placeholder:text-gray-400" />
                <button className="bg-gold-500 text-white p-3" onClick={() => { onSearch?.(searchQuery); setIsSearchOpen(false); setIsMenuOpen(false); }}>
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-gray-800">
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { onViewChange?.('home'); setIsMenuOpen(false); }}>Home</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { goToSection('about'); setIsMenuOpen(false); }}>About Us</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { goToSection('presence'); setIsMenuOpen(false); }}>Presence</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { goToSection('brands'); setIsMenuOpen(false); }}>Brands</button>
              {(userRole === 'admin' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) && (
                <button className="py-3 px-2 text-left border-b border-gray-50 text-gold-600 font-black hover:text-gold-700 transition-colors" onClick={() => { onViewChange?.('admin'); setIsMenuOpen(false); }}>Admin Portal</button>
              )}
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { onCategorySelect?.('All'); setIsMenuOpen(false); }}>All Products</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { onViewChange?.('blogs'); setIsMenuOpen(false); }}>Blogs</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { onViewChange?.('wishlist'); setIsMenuOpen(false); }}>Saved Items</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { goToSection('distributor-inquiry'); setIsMenuOpen(false); }}>Distributor Inquiry</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { onViewChange?.('faq'); setIsMenuOpen(false); }}>FAQ</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-gold-600 transition-colors" onClick={() => { onViewChange?.('certificates'); setIsMenuOpen(false); }}>Certifications</button>
            </div>

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gold-50 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-gold-600" /></div>
                    <span className="text-xs text-gray-600 truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Sign Out</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-gray-200 rounded-xl hover:border-gold-300">Sign In</button>
                  <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-white bg-gray-900 rounded-xl hover:bg-gold-600">Create Account</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
