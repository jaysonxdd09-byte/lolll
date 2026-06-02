import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, Search, ChevronRight, ChevronDown, MessageCircle, Award, LogOut, LayoutDashboard, Settings, Heart, Shield, Layers, HeartPulse, Package, Scissors, Stethoscope, Activity, Plus, Zap, Globe, Syringe, BarChart2 } from 'lucide-react';
import { products } from '../data/products';
import AuthModal from './AuthModal';
import { db } from '../lib/dbClient';

interface NavbarProps {
  cartCount: number;
  savedCount?: number;
  onCategorySelect?: (category: string) => void;
  onViewChange?: (view: any) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  currentView?: any;
  onCartToggle?: () => void;
  user?: any;
  userRole?: 'customer' | 'staff' | 'admin';
}

export default function Navbar({ cartCount, savedCount = 0, onCategorySelect, onViewChange, onSearch, searchQuery = '', currentView, onCartToggle, user, userRole }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [activeHoverBrand, setActiveHoverBrand] = useState('Paramount');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brandsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageError = (name: string) => {
    setFailedImages(prev => ({ ...prev, [name]: true }));
  };

  const handleMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const handleBrandsMouseEnter = () => {
    if (brandsMenuTimeoutRef.current) clearTimeout(brandsMenuTimeoutRef.current);
    setIsBrandsMenuOpen(true);
  };

  const handleBrandsMouseLeave = () => {
    brandsMenuTimeoutRef.current = setTimeout(() => {
      setIsBrandsMenuOpen(false);
    }, 150);
  };

  const handleProductClick = (itemName: string) => {
    onSearch?.(itemName);
    setIsMegaMenuOpen(false);
    setIsBrandsMenuOpen(false);
  };

  const megaMenuData = [
    {
      category: "Drape Accessories",
      Icon: Layers,
      items: [
        "C Arm Cover",
        "Camera Cover",
        "Cling Drape"
      ]
    },
    {
      category: "Orthopedic Drape",
      Icon: Activity,
      items: [
        "Knee O Drape",
        "Hip U Drape",
        "Lamino Spinal Drape"
      ]
    },
    {
      category: "Surgical Gown",
      Icon: Shield,
      items: [
        "Full Gown (Cuff Around Wrap)",
        "Half Gown",
        "Reinforced Gown"
      ]
    },
    {
      category: "Cardiac Drape",
      Icon: HeartPulse,
      items: [
        "Angiography Drape",
        "Angioplasty Drape"
      ]
    },
    {
      category: "Surgical Kits",
      Icon: Package,
      items: [
        "X-Test Delivery Drape Kit",
        "X-Test Ceaserian Drape Kit",
        "X-Test T.H.R Drape Kit",
        "X-Test T.K.R Drape Kit",
        "L.S.C.S Drape Kit",
        "Laproscopy Drape Kit"
      ]
    },
    {
      category: "Surgical Tapes",
      Icon: Layers,
      items: [
        "Microporous Paper Tape 1 inch",
        "Microporous Paper Tape 2 inch"
      ]
    }
  ];

  const brandsMenuData = [
    {
      name: 'Paramount',
      color: '#1a6fc4',
      logo: '/images/brands/paramount.png',
      Icon: Shield,
      products: [
        "Skin Prepping",
        "Arokleen Medium Adult Diaper", "Arokleen Large Adult Diaper", "Arokleen X-Large Adult Diaper", "Arokleen Overnight X-Large Adult Diaper",
        "Drip Free Large Adult Diaper", "Drip Free X-Large Adult Diaper",
        "Arokleen Medium Pull-Ups", "Arokleen Large Pull-Ups", "Arokleen X-Large Pull-Ups",
        "Drip Free Medium Pull-Ups", "Drip Free Large Pull-Ups", "Drip Free X-Large Pull-Ups",
        "Underpad 60x90cm", "Hospital Undersheet",
        "Arokleen Baby Wipes", "Arokleen Bed Bath Patient Wipes",
        "3 Ply Non-Medical Mask", "3 Ply Medical Grade Mask", "N95 Without Respirator", "N95 Respirator Ear Loop", "N95 Respirator Head Loop"
      ]
    },
    {
      name: 'Blades',
      color: '#374151',
      logo: '/images/brands/blades.png',
      Icon: Scissors,
      products: [
        "Carbon Steel Surgical Blades",
        "Disposable Scalpel",
        "Skin Grafting Blades",
        "Disposable Prep Razor",
        "Disposable Prep Razor Double Side",
        "Biopsy Punch"
      ]
    },
    {
      name: 'Smith & Nephew',
      color: '#0055a5',
      logo: '/images/brands/smith.png',
      Icon: Stethoscope,
      products: [
        "Opsite 45x28cm", "Opsite 30x28cm", "Opsite 35x10cm", "Opsite 10x14cm", "Opsite 45x55cm",
        "Opsite Incise 15x28cm", "Opsite Incise 30x28cm", "Opsite Incise 45x28cm", "Opsite Incise 45x55cm",
        "Opsite Post-Op 35x10cm", "Opsite Post-Op 30x10cm", "Opsite Post-Op 6.5x5cm",
        "Jelonet 10x30cm", "Jelonet 10x10cm", "Jelonet 10 Pouches 10x10cm", "Jelonet 10 Boxes 20 Dressings 10x10cm",
        "IV3000 Ported 7x9cm", "IV3000 Ported 5x6cm", "IV3000 10x12cm",
        "Primapore 35x10cm", "Primapore 30x10cm", "Primapore 20x10cm", "Primapore 25x10cm", "Primapore 15x8cm", "Primapore 8.3x6cm",
        "Bactigras Chlorhexidine Gauze Dressing 10x10cm", "Allevyn Gentle Border 10x20cm", "Allevyn Gentle Border 10x30cm"
      ]
    },
    {
      name: 'Johnson & Johnson',
      color: '#cc0000',
      logo: '/images/brands/jnj.png',
      Icon: Plus,
      products: [
        "VICRYL Plus 1 (4 Metric) VP2352P",
        "VICRYL Plus 2-0 (3 Metric) VP2345",
        "ETHILON NW3338P"
      ]
    },
    {
      name: 'Surgiwear',
      color: '#006633',
      logo: '/images/brands/surgiwear.png',
      Icon: Layers,
      products: [
        "Plain Sheet D300", "Plain Sheet D301", "Eye Patch D602", "Eye Drape Eco E710", "Eye Drape Plain D700",
        "PCNL Drape ECO E913", "Surgiwear Knee-O Drape", "TURP Drape", "Surgiwear Hip-U Drape",
        "Surgiwear C-Arm Cover", "Lamino Drape", "Surgiwear Camera Cover",
        "Angiography Drape ECO E413", "Arthroscopy Drape ECO E518",
        "Baby Drape D201", "Craniotomy Drape ECO E911",
        "IO Drape Large ID3535-1", "IO Drape Medium ID3025-2F", "IO Drape Small ID1020",
        "Chhabra Shunt VPLP SH203", "Chhabra Shunt VPLP SH202", "VP Shunt HP SH201",
        "Ventricular External Drainage System SH024", "Lumbar External Drainage System SH025",
        "Full Gown Eco Large MAE812L", "Full Gown Eco MAE812CM", "Half Gown D800",
        "Burn Mesh BM1015", "Burn Mesh BM1525", "Burn Mesh BM2530", "Burn Mesh BM10200",
        "G-Bone HAP01 1gm", "G-Bone HAP02 2gm", "G-Bone HAP05 5gm", "G-Bone HAP10 10gm",
        "G-Patch GP-01 Small", "G-Patch GP-02 Large", "G-Patch GP-03 Extra Large",
        "G-Dress Comfy GD5", "G-Dress Comfy GD10", "G-Dress Comfy GD15",
        "G-Dress Swimproof GD5", "G-Dress Swimproof GD10", "G-Dress Swimproof GD20"
      ]
    },
    {
      name: 'Healthium',
      color: '#005b8e',
      logo: '/images/brands/healthium.png',
      Icon: Activity,
      products: [
        "Truglyde SN2346 0 (3.5 Metric)",
        "Trugut SN2215",
        "Trusynth TS2421",
        "Trusynth TS2534",
        "Trusynth TS2825"
      ]
    },
    {
      name: '3M',
      color: '#ff0000',
      logo: '/images/brands/3m.png',
      Icon: Award,
      products: [
        "Micropore Surgical Tape", "Transpore Surgical Tape", "Durapore Tape", "Medipore High Adhesion Tape", "Steri-Strip R1540",
        "Tegaderm 8591IN", "Tegaderm 1610IN", "Tegaderm 1633", "Tegaderm 1660R",
        "Ioban 6640", "Ioban 6635", "Ioban 6650",
        "Steri-Drape 1015", "Steri-Drape 1016",
        "9681 Surgical Clipper", "9680 Blade Assembly",
        "1322 Lead Free Indicator Tape", "1243B Steam Integrator",
        "8624IN Skin Prep 5% 100ml", "8623IN Skin Prep 5% 500ml",
        "Avagard CHG Handrub", "Avagard Alcohol Handrub",
        "ECG Electrodes", "Cavilon 3345 No Sting Barrier Film"
      ]
    },
    {
      name: 'HMD',
      color: '#8b1a1a',
      logo: '/images/brands/hmd.png',
      Icon: Syringe,
      products: [
        "Vaku-8 Red",
        "Vaku-8 Blue",
        "Vaku-8 Lavender"
      ]
    },
    {
      name: 'BSN Essity',
      color: '#00527e',
      logo: '/images/brands/bsn.png',
      Icon: Heart,
      products: [
        "Leukoband 10cm x 4.6m",
        "Fixomull Stretch 10cm x 10m",
        "Cannula Fixator BSN",
        "Cone Examination Gloves",
        "Cone Nitrile Gloves",
        "Cone ECG Electrodes",
        "Articast Series",
        "Cuticell Series",
        "Elastomull Series",
        "Gypsona Series"
      ]
    },
    {
      name: 'Optima',
      color: '#e67e00',
      logo: '/images/brands/optima.png',
      Icon: BarChart2,
      products: [
        "Optima OBP-115 BP Monitor", "Optima OBP-119 BP Monitor",
        "Optima Regular Nebulizer", "Optima Premium Nebulizer",
        "Optima Single Wall Vaporizer", "Optima Double Wall Vaporizer",
        "Crepe Regular 6cm Bandage", "Crepe Regular 8cm Bandage", "Crepe Regular 10cm Bandage", "Crepe Regular 15cm Bandage",
        "Crepe Premium 6cm Bandage", "Crepe Premium 8cm Bandage", "Crepe Premium 10cm Bandage", "Crepe Premium 15cm Bandage",
        "Optima Cannula Fixator", "Optima Digital Thermometer", "Optima Weighing Scale",
        "Optima Disposable Prep Razor", "Optima Patient Wipes", "Optima Baby Wipes"
      ]
    },
    {
      name: 'Romsons',
      color: '#006d5b',
      logo: '/images/brands/romsons.png',
      Icon: Shield,
      products: [
        "Foley Catheter (10 Pack)",
        "External Catheters",
        "Urine Bags",
        "Standard Surgical Scissors",
        "Surgical Gauze Swabs"
      ]
    },
    {
      name: 'Polymed',
      color: '#008ba3',
      logo: '/images/brands/polymed.png',
      Icon: Activity,
      products: [
        "IV Cannula 14G", "IV Cannula 16G", "IV Cannula 18G", "IV Cannula 20G", "IV Cannula 22G",
        "IV Cannula 24G Neonates", "IV Cannula 26G Neonates",
        "Dispovan 3ml Syringe", "Dispovan 5ml Syringe", "Dispovan 8ml Syringe",
        "Nipro 2ml Syringe", "Nipro 3ml Syringe", "Nipro 5ml Syringe",
        "Insulin Syringes (100 Pack)"
      ]
    },
    {
      name: 'Coloplast',
      color: '#002f6c',
      logo: '/images/brands/coloplast.png',
      Icon: Globe,
      products: [
        "Ostomy Pouch Set",
        "Barriers & Wafers",
        "Adhesive Removers",
        "Ostomy Belts",
        "Skin Care Cream"
      ]
    },
    {
      name: 'Dr. Morepen',
      color: '#f37021',
      logo: '/images/brands/morepen.png',
      Icon: HeartPulse,
      products: [
        "Digital Blood Pressure Monitor",
        "Pulse Oximeter",
        "Infrared Thermometer",
        "Glucometer Kit"
      ]
    },
    {
      name: 'Adlisc',
      color: '#e31e24',
      logo: '/images/brands/adlisc.png',
      Icon: Zap,
      products: [
        "Ortho Surgery Drape Kit",
        "Gynaecology Drape Kit",
        "Cardiac Drape Kit",
        "Neuro Surgery Drape Kit"
      ]
    },
    {
      name: 'Friends',
      color: '#39b54a',
      logo: '/images/brands/friends.png',
      Icon: User,
      products: [
        "Adult Diapers Premium",
        "Underpads",
        "Adult Wipes",
        "Fine Gamjee"
      ]
    },
    {
      name: 'Flamingo',
      color: '#662d91',
      logo: '/images/brands/flamingo.png',
      Icon: Package,
      products: [
        "Knee Support Brace",
        "Casting Supplies",
        "Compression Stockings",
        "Splints",
        "Traction Equipment"
      ]
    }
  ];

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
      db.authStore.clear();
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
      <div className="max-w-[95%] mx-auto px-2 sm:px-6 xl:px-8 bg-white">
        <div className="flex items-center gap-2.5 xl:gap-5.5 h-20 sm:h-26 xl:h-32">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => onViewChange?.('home')}>
            <div className="h-13 sm:h-17 xl:h-22 w-auto flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img src="/images/logo/logo.png" alt="TEST ONE" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-3xl xl:text-4.5xl font-black tracking-tighter text-gray-900 leading-none">
                TEST <span className="text-primary-500">ONE</span>
              </span>
              <span className="text-[8.5px] sm:text-[11px] xl:text-[12.5px] font-black uppercase tracking-[0.25em] xl:tracking-[0.45em] text-gray-400 mt-1.5 whitespace-nowrap">Solutions India</span>
            </div>
          </div>

          {/* Inline nav — Our Products, Other Brand */}
          <div className="hidden lg:flex items-center gap-x-2.5 xl:gap-x-3.5 flex-shrink-0">
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="py-2"
            >
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`px-3.5 py-2.5 xl:px-5 xl:py-3 rounded-2xl text-[10.5px] xl:text-[12px] font-extrabold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-1.5 border-2 ${
                  isMegaMenuOpen 
                    ? 'text-primary-700 bg-primary-50 border-primary-200' 
                    : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50 hover:border-primary-200 border-gray-50 bg-white'
                }`}
              >
                Our Products
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180 text-primary-600' : ''}`} />
              </button>
            </div>
            <div
              onMouseEnter={handleBrandsMouseEnter}
              onMouseLeave={handleBrandsMouseLeave}
              className="py-2"
            >
              <button
                type="button"
                onClick={() => goToSection('brands')}
                className={`px-3.5 py-2.5 xl:px-5 xl:py-3 rounded-2xl text-[10.5px] xl:text-[12px] font-extrabold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-1.5 border-2 ${
                  isBrandsMenuOpen 
                    ? 'text-primary-700 bg-primary-50 border-primary-200' 
                    : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50 hover:border-primary-200 border-gray-50 bg-white'
                }`}
              >
                Other Brand
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isBrandsMenuOpen ? 'rotate-180 text-primary-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mid Section - Search Bar */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-xl xl:max-w-2xl px-1 lg:px-2 xl:px-6" ref={searchRef}>
            <div className="relative w-full flex items-center bg-white border border-gray-200 rounded-2xl focus-within:border-primary-500 transition-all shadow-sm">
              <div className="relative group/cat">
                <button className="flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-5 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border-r border-gray-100 rounded-l-2xl hover:bg-gray-100 transition-colors">
                  <span className="text-[10px] xl:text-[11.5px] font-bold text-gray-600 uppercase tracking-tight whitespace-nowrap">All</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Test One"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => { if (searchQuery.trim().length > 0) setIsSearchOpen(true); }}
                  className="w-full bg-transparent border-none text-xs xl:text-sm px-4 xl:px-5 py-2.5 sm:py-3 xl:py-3.5 focus:ring-0 outline-none placeholder:text-gray-400 text-gray-900"
                />
                {isSearchOpen && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[100]">
                    <div className="py-2">
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map((p) => (
                        <button key={p.id} onClick={() => handleSuggestionClick(p.name)} className="w-full flex items-center gap-4 px-6 py-3 hover:bg-primary-50/50 transition-colors text-left group">
                          <Search className="w-4 h-4 text-gray-300 group-hover:text-primary-500" />
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
                           <button key={t} onClick={() => handleSuggestionClick(t)} className="text-[9px] font-bold text-primary-600 hover:underline">#{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="bg-primary-500 hover:bg-primary-600 text-white p-2.5 sm:p-3 xl:p-3.5 rounded-r-2xl transition-all shadow-lg shadow-primary-500/10" onClick={() => { onSearch?.(searchQuery); setIsSearchOpen(false); }}>
                <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-8 text-gray-700 ml-auto flex-shrink-0">
            {/* Auth - Desktop */}
            <div className="hidden lg:flex items-center gap-3 border-r border-gray-100 pr-5 mr-1">
              {(userRole === 'admin' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) && (
                <button 
                  onClick={() => onViewChange?.('admin')} 
                  className="hidden md:flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-[10.5px] xl:text-[12px] font-bold uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 border border-primary-500"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                </button>
              )}
              {user ? (
                <>
                {/* My Orders Button - Beside User */}
                <button 
                  onClick={() => onViewChange?.('my-orders')} 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors border border-gray-100 hover:border-primary-200"
                >
                  <Package className="w-4 h-4" /> My Orders
                </button>
                
                <div className="group relative py-2.5">
                  <button className="flex items-center gap-2 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center group-hover:border-primary-300 group-hover:bg-primary-50 transition-all">
                      <User className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Signed in as</p>
                      <p className="text-xs text-gray-900 truncate font-medium">{user.email}</p>
                    </div>
                    
                    <button className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" /> User Settings
                    </button>
                    
                    {(userRole === 'admin' || userRole === 'staff' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) && (
                      <button onClick={() => onViewChange?.('admin')} className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors flex items-center gap-2 bg-primary-50/30">
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
                </>
              ) : (
                <>
                  <button onClick={() => setIsAuthModalOpen(true)} className="text-[10.5px] xl:text-[12px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-600 transition-colors whitespace-nowrap">Sign In</button>
                  <button onClick={() => setIsAuthModalOpen(true)} className="bg-gray-900 text-white px-4.5 xl:px-6 py-2.5 xl:py-3 rounded-2xl text-[10.5px] xl:text-[12px] font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-gray-900/10 whitespace-nowrap">Create Account</button>
                </>
              )}
            </div>

            <button 
              className="relative flex flex-col items-center gap-1 group" 
              onClick={() => onViewChange?.('wishlist')}
            >
              <div className="relative">
                <Heart className={`h-5 w-5 sm:h-5.5 sm:w-5.5 xl:h-6.5 xl:w-6.5 transition-colors ${currentView === 'wishlist' ? 'text-primary-500 fill-primary-500' : 'text-gray-700 group-hover:text-primary-500'}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{savedCount}</span>
                )}
              </div>
            </button>

            <button className="relative flex flex-col items-center gap-1 group" onClick={onCartToggle}>
              <div className="relative">
                <ShoppingCart className="h-5 w-5 sm:h-5.5 sm:w-5.5 xl:h-6.5 xl:w-6.5 group-hover:text-primary-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
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
      <div className="hidden lg:block bg-primary-50 border-t border-primary-100">
        <div className="max-w-[95%] mx-auto px-4 xl:px-8 flex items-center justify-between py-0.5 relative">
          <div className="flex items-center gap-2.5 lg:gap-4 xl:gap-8">
            {[
              { name: 'Catheters & Drainages', subItems: ['External Catheters', 'Foley Catheters', 'Intermittent Catheters', 'Urine Bags', 'Drainage Trays'] },
              { name: 'Orthopaedic Products', subItems: ['Braces & Supports', 'Casting Supplies', 'Compression Stockings', 'Splints', 'Traction Equipment'] },
              { name: 'Ostomy Care', subItems: ['Bags & Pouches', 'Barriers & Wafers', 'Adhesive Removers', 'Belts', 'Skin Care'] },
              { name: 'Surgical Supplies', subItems: ['Gauze & Sponges', 'Surgical Tape', 'Drapes', 'Sutures', 'Gloves'] },
              { name: 'Syringes & Needles', subItems: ['Insulin Syringes', 'Standard Syringes', 'Safety Needles', 'Spinal Needles', 'Dispensing Needles'] },
              { name: 'Wound Care', subItems: ['Bandages', 'Dressing', 'Wound Cleansers', 'Antiseptics', 'Scar Treatments'] }
            ].map((item, idx) => (
              <div key={idx} className="group relative py-2">
                <button className="flex items-center gap-1 cursor-pointer whitespace-nowrap" onClick={() => onCategorySelect?.(item.name)}>
                  <span className="text-[10px] lg:text-[11px] xl:text-[11.5px] font-bold text-gray-700 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{item.name}</span>
                  <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-primary-500 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-b-xl py-4 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex flex-col">
                    {item.subItems.map((sub, sIdx) => (
                      <button key={sIdx} className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50/50 transition-colors border-l-2 border-transparent hover:border-primary-400" onClick={() => onCategorySelect?.(item.name)}>{sub}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
            <button className={`flex items-center gap-1.5 lg:gap-2 group cursor-pointer whitespace-nowrap py-2 ${currentView === 'certificates' ? 'text-primary-600 border-b-2 border-primary-500' : ''}`} onClick={() => onViewChange?.('certificates')}>
              <Award className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-primary-500" />
              <span className="text-[10px] lg:text-[11px] xl:text-[11.5px] font-bold text-gray-700 group-hover:text-primary-600 transition-colors uppercase tracking-tight">Certifications</span>
            </button>
            <button className={`flex items-center gap-1.5 lg:gap-2 group cursor-pointer whitespace-nowrap py-2 ${currentView === 'blogs' ? 'text-primary-600 border-b-2 border-primary-500' : ''}`} onClick={() => onViewChange?.('blogs')}>
              <span className="text-[10px] lg:text-[11px] xl:text-[11.5px] font-bold text-gray-700 group-hover:text-primary-600 transition-colors uppercase tracking-tight">Blogs</span>
            </button>
            <button className={`flex items-center gap-1.5 lg:gap-2 group cursor-pointer whitespace-nowrap py-2 ${currentView === 'faq' ? 'text-primary-600 border-b-2 border-primary-500' : ''}`} onClick={() => onViewChange?.('faq')}>
              <span className="text-[10px] lg:text-[11px] xl:text-[11.5px] font-bold text-gray-700 group-hover:text-primary-600 transition-colors uppercase tracking-tight">FAQ</span>
            </button>
            <button className="flex items-center gap-1.5 lg:gap-2 group cursor-pointer whitespace-nowrap py-2" onClick={() => onCategorySelect?.('All')}>
              <span className="text-[10px] lg:text-[11px] xl:text-[11.5px] font-bold text-gray-700 group-hover:text-primary-600 transition-colors uppercase tracking-tight">View All</span>
              <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-primary-500 transition-colors" />
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
                <button className="bg-primary-500 text-white p-3" onClick={() => { onSearch?.(searchQuery); setIsSearchOpen(false); setIsMenuOpen(false); }}>
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-gray-800">
              <div className="border-b border-gray-50">
                <button 
                  className="w-full py-3 px-2 text-left flex items-center justify-between hover:text-primary-600 transition-colors" 
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                >
                  <span>Our Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180 text-primary-600' : ''}`} />
                </button>
                {isMobileProductsOpen && (
                  <div className="pl-4 pr-2 pb-3 bg-gray-50/50 rounded-lg space-y-3 mt-1 py-2">
                    {megaMenuData.map((col, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1.5">
                          <col.Icon className="w-3.5 h-3.5 text-primary-600" />
                          <span>{col.category}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 pl-2 mt-1">
                          {col.items.map((item, itemIdx) => (
                            <button
                              key={itemIdx}
                              onClick={() => {
                                handleProductClick(item);
                                setIsMenuOpen(false);
                              }}
                              className="text-left text-[11px] font-bold text-gray-500 hover:text-primary-600 transition-colors py-1 flex items-center"
                            >
                              <span className="inline-flex items-center justify-center border border-primary-500 rounded text-primary-500 h-3 w-3 mr-1.5 flex-shrink-0">
                                <svg className="h-1.5 w-1.5 fill-current" viewBox="0 0 20 20">
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                                </svg>
                              </span>
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { goToSection('brands'); setIsMenuOpen(false); }}>Other Brand</button>
              {(userRole === 'admin' || ['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase())) && (
                <button className="py-3 px-2 text-left border-b border-gray-50 text-primary-600 font-black hover:text-primary-700 transition-colors" onClick={() => { onViewChange?.('admin'); setIsMenuOpen(false); }}>Admin Portal</button>
              )}
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { onCategorySelect?.('All'); setIsMenuOpen(false); }}>All Products</button>
              <button
                className="py-3 px-2 text-left border-b border-gray-50 transition-colors flex items-center gap-2 font-black text-primary-700 hover:text-primary-800"
                onClick={() => { onViewChange?.('my-orders'); setIsMenuOpen(false); }}
              >
                <Package className="w-4 h-4" /> My Orders
              </button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { onViewChange?.('blogs'); setIsMenuOpen(false); }}>Blogs</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { onViewChange?.('wishlist'); setIsMenuOpen(false); }}>Saved Items</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { goToSection('inquiry'); setIsMenuOpen(false); }}>Inquiry</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { onViewChange?.('faq'); setIsMenuOpen(false); }}>FAQ</button>
              <button className="py-3 px-2 text-left border-b border-gray-50 hover:text-primary-600 transition-colors" onClick={() => { onViewChange?.('certificates'); setIsMenuOpen(false); }}>Certifications</button>
            </div>

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-primary-600" /></div>
                    <span className="text-xs text-gray-600 truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Sign Out</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-gray-200 rounded-xl hover:border-primary-300">Sign In</button>
                  <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-white bg-gray-900 rounded-xl hover:bg-primary-600">Create Account</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7-Column Mega Menu */}
      {isMegaMenuOpen && (
        <div 
          className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-[100] rounded-b-2xl max-w-[95%] mx-auto transition-all duration-300"
          style={{ top: '100%' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-6 xl:gap-8 p-6 xl:p-10 max-h-[80vh] xl:max-h-none overflow-y-auto">
            {megaMenuData.map((col, idx) => (
              <div key={idx} className="flex flex-col group min-w-0">
                {/* Gold Category Icon Container */}
                <div className="w-11 h-11 xl:w-14 xl:h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-3 xl:mb-4 transition-all duration-300 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:scale-110 shadow-sm group-hover:shadow-primary-500/20">
                  <col.Icon className="w-5 h-5 xl:w-6 xl:h-6 text-primary-600 transition-colors duration-300 group-hover:text-white" />
                </div>
                {/* Category Header */}
                <h3 className="text-xs sm:text-sm font-black text-primary-600 uppercase tracking-wider mb-2 xl:mb-3 pb-2 border-b border-gray-100 min-h-[28px] xl:min-h-[32px] flex items-end">
                  {col.category}
                </h3>
                {/* Items Checklist */}
                <div className="flex flex-col gap-2.5 xl:gap-3.5 mt-1">
                  {col.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleProductClick(item)}
                      className="flex items-start text-left text-xs xl:text-[13px] font-extrabold text-gray-600 hover:text-primary-600 transition-colors duration-200 group/item"
                    >
                      {/* Gold Square Checkbox */}
                      <span className="inline-flex items-center justify-center border border-primary-500 rounded text-primary-500 h-3.5 w-3.5 xl:h-4 xl:w-4 mr-2 xl:mr-2.5 flex-shrink-0 mt-0.5 group-hover/item:bg-primary-50 transition-colors">
                        <svg className="h-2 w-2 xl:h-2.5 xl:w-2.5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                        </svg>
                      </span>
                      <span className="leading-tight flex-1">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands Explorer Mega Menu */}
      {isBrandsMenuOpen && (
        <div 
          className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-[100] rounded-b-2xl max-w-[95%] mx-auto transition-all duration-300"
          style={{ top: '100%' }}
          onMouseEnter={handleBrandsMouseEnter}
          onMouseLeave={handleBrandsMouseLeave}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xl:gap-8 p-6 xl:p-8 max-h-[80vh] xl:max-h-[600px] overflow-y-auto">
            {/* Left Column: Brand list sidebar */}
            <div className="col-span-1 md:col-span-4 border-r border-gray-100 pr-0 md:pr-6 space-y-2 max-h-[300px] md:max-h-[480px] overflow-y-auto">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Explore by Manufacturer
              </div>
              <div className="space-y-1.5">
                {brandsMenuData.map((brand) => (
                  <div
                    key={brand.name}
                    onMouseEnter={() => setActiveHoverBrand(brand.name)}
                    onClick={() => {
                      onSearch?.(brand.name);
                      setIsBrandsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 xl:p-3 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                      activeHoverBrand === brand.name
                        ? 'bg-primary-50/70 border-primary-200 shadow-md shadow-primary-500/5 translate-x-1'
                        : 'bg-transparent border-transparent hover:bg-gray-50/70 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 xl:gap-3">
                      <div className="w-8 h-8 xl:w-10 xl:h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-1 relative overflow-hidden flex-shrink-0 shadow-sm">
                        {!failedImages[brand.name] ? (
                          <img
                            src={brand.logo}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                            onError={() => handleImageError(brand.name)}
                          />
                        ) : (
                          <brand.Icon className="w-4 h-4 xl:w-5 xl:h-5" style={{ color: brand.color }} />
                        )}
                      </div>
                      <span className={`text-xs xl:text-sm font-extrabold transition-colors duration-300 ${activeHoverBrand === brand.name ? 'text-primary-700' : 'text-gray-700'}`}>
                        {brand.name}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-400 transition-all duration-300 ${activeHoverBrand === brand.name ? 'opacity-100 translate-x-0.5 text-primary-600' : 'opacity-0'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Brand products showcase */}
            <div className="col-span-1 md:col-span-8 space-y-6 pl-0 md:pl-4 max-h-[300px] md:max-h-[480px] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                  <h4 className="text-xs xl:text-sm font-black uppercase tracking-widest text-primary-600 flex items-center gap-2">
                    <span>Products under {activeHoverBrand}</span>
                  </h4>
                  <button
                    onClick={() => {
                      onSearch?.(activeHoverBrand);
                      setIsBrandsMenuOpen(false);
                    }}
                    className="text-[9px] xl:text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 hover:underline transition-all"
                  >
                    View All {activeHoverBrand} Products &rarr;
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 xl:gap-x-8 gap-y-3 xl:gap-y-4">
                  {brandsMenuData.find(b => b.name === activeHoverBrand)?.products.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleProductClick(item)}
                      className="flex items-start text-left text-xs xl:text-[13px] font-extrabold text-gray-600 hover:text-primary-600 transition-colors duration-200 group/item py-1"
                    >
                      {/* Gold Square Checkbox */}
                      <span className="inline-flex items-center justify-center border border-primary-500 rounded text-primary-500 h-3.5 w-3.5 xl:h-4 xl:w-4 mr-2 xl:mr-2.5 flex-shrink-0 mt-0.5 group-hover/item:bg-primary-50 transition-colors">
                        <svg className="h-2 w-2 xl:h-2.5 xl:w-2.5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                        </svg>
                      </span>
                      <span className="leading-tight flex-1">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

