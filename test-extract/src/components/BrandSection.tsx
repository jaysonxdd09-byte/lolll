import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Shield, Activity, Zap, Heart, Globe, Plus, Award, Package, Scissors, Stethoscope, Layers, Bandage, Syringe, BarChart2 } from 'lucide-react';

interface Brand {
  name: string;
  color: string;
  logo: string;
  Icon: React.ElementType;
}

// Only brands that have products in our database (based on products.ts)
const brands: Brand[] = [
  { name: '3M',                 color: '#ff0000', logo: '/images/brands/3m.png',              Icon: Award },
  { name: 'Smith & Nephew',     color: '#0055a5', logo: '/images/brands/smith.png',           Icon: Stethoscope },
  { name: 'Surgiwear',          color: '#006633', logo: '/images/brands/surgiwear.png',       Icon: Layers },
  { name: 'BSN Essity',         color: '#00527e', logo: '/images/brands/bsn.png',             Icon: Bandage },
  { name: 'Paramount',          color: '#1a6fc4', logo: '/images/brands/paramount.png',       Icon: Shield },
  { name: 'Sanvin Care Pvt Ltd', color: '#d4af37', logo: '/images/brands/sanvin.png',          Icon: Heart },
  { name: 'ESS KAE Medicure',    color: '#008080', logo: '/images/brands/esskae.png',          Icon: Syringe },
  { name: 'Test One',           color: '#b8860b', logo: '/images/logo/logo.png',              Icon: Package },
  { name: 'testone',            color: '#002970', logo: '/images/logo/logo.png',              Icon: Package },
];

interface BrandSectionProps {
  onBrandClick: (brandName: string) => void;
}

const BrandSection: React.FC<BrandSectionProps> = ({ onBrandClick }) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    setFailedImages(prev => ({ ...prev, [name]: true }));
  };

  return (
    <section id="brands" className="py-12 bg-white">
      <div className="max-w-[95%] mx-auto px-8">
        {/* Brands Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">Brands</h2>
          </div>
          <button className="text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:text-primary-700 flex items-center gap-2 group transition-all">
            View all Brand
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3D Rounded Squares Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-6 mb-12">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onBrandClick(brand.name)}
              className="group relative cursor-pointer"
            >
              <div className="aspect-square bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 flex items-center justify-center p-6 relative overflow-hidden group-hover:-translate-y-2">
                {/* 3D Glass Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Logo Content */}
                <div className="relative z-10 flex flex-col items-center w-full h-full">
                  <div className="w-full h-full flex items-center justify-center transition-all duration-500">
                    {!failedImages[brand.name] ? (
                      <img 
                        src={brand.logo} 
                        alt="" 
                        className="max-w-full max-h-full object-contain transition-all duration-700"
                        onError={() => handleImageError(brand.name)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <brand.Icon 
                          className="w-8 h-8 mb-3 transition-transform duration-500 group-hover:scale-110"
                          style={{ color: brand.color }}
                        />
                        <span 
                          className="text-[10px] font-black uppercase tracking-widest"
                          style={{ color: brand.color }}
                        >
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Bottom Glow */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: brand.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrandSection;

