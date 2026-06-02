import React, { useState, useMemo } from 'react';
import { Product, categories, brands } from '../data/products';
import { brandImages, defaultBrandImage } from '../data/brandImages';
import ProductCard from './ProductCard';
import DoctorTestimonialsSection from './DoctorTestimonialsSection';
import PresenceSection from './PresenceSection';
import { Search, ShoppingCart, Package, Building2, Phone, Mail, MapPin, ChevronDown, Star, ArrowRight, Globe, Heart } from 'lucide-react';

interface MedicalSuppliesHomeProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export default function MedicalSuppliesHome({ 
  products, 
  onAddToCart, 
  onProductClick, 
  onBuyNow 
}: MedicalSuppliesHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</span>
            <span className="flex items-center gap-2"><Mail size={14} /> info@testone.com</span>
          </div>
          <span className="hidden sm:block">Free shipping on orders above ₹5000</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Test<span className="text-primary-600">One</span></span>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-xl relative">
              <input
                type="text"
                placeholder="Search products, categories, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primary-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full font-medium hover:bg-primary-100">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Categories:</span>
              {categories.slice(0, 8).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Medical Supplies
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Quality surgical products from top brands like 3M, Smith & Nephew, Surgiwear, and more. Trusted by healthcare professionals across India.
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-300 fill-current" /> 4.9/5 Rating</span>
                <span className="flex items-center gap-2"><Package className="w-5 h-5" /> 153+ Products</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {brands.slice(0, 4).map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-colors"
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">{brand}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-gray-500">Filter by:</span>
            
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 px-4 py-2 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-primary-500"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Brand Dropdown */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 px-4 py-2 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-primary-500"
              >
                <option value="All">All Brands</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <span className="text-sm text-gray-500 ml-auto">
              Showing {filteredProducts.length} products
            </span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => onAddToCart(product)}
                  onClick={() => onProductClick(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Doctor Testimonials Section */}
      <DoctorTestimonialsSection />

      {/* Presence Section */}
      <PresenceSection />

      {/* Brands Section */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Trusted Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 transition-colors group border border-gray-100"
              >
                <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden">
                  <img 
                    src={brandImages[brand] || defaultBrandImage} 
                    alt={brand}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = defaultBrandImage;
                    }}
                  />
                </div>
                <span className="font-semibold text-gray-900 text-sm">{brand}</span>
                <p className="text-xs text-gray-500 mt-1">
                  {products.filter(p => p.brand === brand).length} products
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Kits Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-primary-600">Complete Solutions</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900">Medical Kits & Procedure Packs</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Pre-configured kits for various medical procedures. All necessary items in one convenient pack.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Kit 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Surgical Procedure Kit</h3>
              <p className="text-gray-500 text-sm mb-4">Complete kit for general surgical procedures including drapes, gowns, and basic instruments.</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> Surgical Gown (2pcs)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> Mayo Stand Cover</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> Adhesive Drapes</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> Instrument Table Cover</li>
              </ul>
              <button className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
                View Details
              </button>
            </div>
            {/* Kit 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cardiac Care Kit</h3>
              <p className="text-gray-500 text-sm mb-4">Specialized kit for cardiac procedures with ECG electrodes and monitoring supplies.</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ECG Electrodes (100pcs)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Cardiac Drapes</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Monitoring Leads</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Defib Pads</li>
              </ul>
              <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                View Details
              </button>
            </div>
            {/* Kit 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Orthopedic Kit</h3>
              <p className="text-gray-500 text-sm mb-4">Comprehensive kit for orthopedic surgeries including bone preparation items.</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Ortho Drapes (10pcs)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Surgical Blades</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Bone Wax</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Suction Tubing</li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold">TestOne</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Premium medical supplies from trusted brands. Quality healthcare products for professionals.
              </p>
              {/* Globe Image */}
              <div className="mt-4">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80" 
                  alt="Global Presence"
                  className="w-32 h-20 object-cover rounded-lg opacity-80"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Serving 30+ Countries
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(1, 6).map(cat => (
                  <li key={cat}><button onClick={() => setSelectedCategory(cat)} className="hover:text-white">{cat}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Brands</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {brands.slice(0, 5).map(brand => (
                  <li key={brand}><button onClick={() => setSelectedBrand(brand)} className="hover:text-white">{brand}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@testone.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mumbai, India</li>
              </ul>
            </div>
          </div>
          
          {/* Made in India & Swachh Bharat */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Made in India */}
                <div className="flex items-center gap-2 bg-orange-600/20 px-4 py-2 rounded-lg">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" 
                    alt="Made in India"
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm font-bold text-orange-400">Made in India</span>
                </div>
                {/* Swachh Bharat */}
                <div className="flex items-center gap-2 bg-green-600/20 px-4 py-2 rounded-lg">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Swachh_Bharat_Abhiyan_Logo.png/1200px-Swachh_Bharat_Abhiyan_Logo.png" 
                    alt="Swachh Bharat"
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm font-bold text-green-400">Swachh Bharat Abhiyan</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center md:text-right">
                © 2024 TestOne Medical Supplies. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
