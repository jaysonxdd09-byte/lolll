import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onViewChange?: (view: string) => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  const navigate = (view: string) => {
    onViewChange?.(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about" className="bg-gray-900 text-white font-sans">
      {/* Main Footer Content */}
      <div className="max-w-[95%] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Contact Info */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <img src="/images/logo/logo.png" alt="TEST ONE" className="h-12 w-auto" />
                <div>
                  <span className="text-xl font-black tracking-tighter text-white">TEST <span className="text-yellow-500">ONE</span></span>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Solutions India</p>
                </div>
              </div>
            </div>
            
            {/* Globe Section */}
            <div className="mt-6">
              <img 
                src="/glovv.png" 
                alt="Global Presence"
                className="w-56 h-auto object-contain"
              />
            </div>
            
            <div className="space-y-3 text-sm text-gray-300">
              <p className="font-medium text-white">Got Question? Call us</p>
              <p className="text-gray-400">(Mon - Sat : 10am - 7pm)</p>
              <div className="flex items-center gap-2 text-yellow-500">
                <Phone className="w-4 h-4" />
                <span className="font-bold">+91-9435372468</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Empowering healthcare excellence through precision-crafted instruments.
              </p>
              <div className="flex gap-3 pt-2">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('faq')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Refund & Cancellation</button></li>
              <li><button onClick={() => navigate('shipping')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Order Shipping Policy</button></li>
              <li><button onClick={() => navigate('terms')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Terms & Conditions</button></li>
              <li><button onClick={() => navigate('privacy')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Privacy Policy</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('about')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> About Us</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Contact Us</button></li>
              <li><button onClick={() => navigate('offers')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Offers</button></li>
              <li><button onClick={() => navigate('faq')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> FAQs</button></li>
              <li><button onClick={() => navigate('shipping')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> How Delivery Works</button></li>
              <li><button onClick={() => navigate('help')} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-left w-full"><span className="text-yellow-500">•</span> Help Center</button></li>
            </ul>
          </div>

          {/* Contact Us & Location */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Contact Us</h4>
            <p className="text-xs text-gray-400 mb-2">Got Question? Call us (Mon - Sat : 10am - 7pm)</p>
            <div className="flex items-center gap-2 text-yellow-500 mb-3">
              <Phone className="w-4 h-4" />
              <span className="font-bold">+91-9435372468</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Mail className="w-4 h-4" />
              <span className="text-sm">INFOTESTONEINDIA@GMAIL.COM</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              <span className="text-gray-400">CIN:</span> U21002MP2024PTC070652
            </div>
            <div className="text-xs text-gray-500 mb-4">
              <span className="text-gray-400">GST:</span> 23AAKCT903IFIZE
            </div>
            <h4 className="text-white font-bold mb-2 text-sm">Our Location</h4>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-bold text-sm">World Map</span>
              </div>
              <p className="text-xs text-gray-400">Global delivery across all continents</p>
            </div>
            
            {/* Made in India & Swachh Bharat - Bottom of Contact Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600/30 to-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/40">
                <img 
                  src="/foos/Make-in-India.webp" 
                  alt="Made in India"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-sm font-black text-orange-400">Made in India</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/30 to-green-500/10 px-3 py-2 rounded-lg border border-green-500/40">
                <img 
                  src="/foos/Swachh_Bharat_Mission_Logo.svg.png" 
                  alt="Swachh Bharat"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-sm font-black text-green-400">Swachh Bharat Abhiyan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-950 py-4 border-t border-gray-800">
        <div className="max-w-[95%] mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs text-gray-500">
            Copyright © 2026 Test One Solutions India | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

