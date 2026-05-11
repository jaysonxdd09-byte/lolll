
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-natural-200/50 font-sans">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-28 h-28 flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/logo/logo.png" 
                  alt="TEST ONE" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
                  TEST <span className="text-gold-500">ONE</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mt-2">Global Medical Supply</span>
              </div>
            </div>
            <p className="text-natural-600/70 text-sm max-w-sm leading-relaxed font-serif">
              Empowering healthcare excellence through precision-crafted instruments and unwavering quality standards.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-natural-600 mb-6 font-sans">Navigation</h4>
            <ul className="space-y-3 text-xs uppercase tracking-widest font-bold text-natural-400 font-sans">
              <li><a href="#" className="hover:text-natural-600 transition-colors">Catalog</a></li>
              <li><a href="#" className="hover:text-natural-600 transition-colors">Wholesale</a></li>
              <li><a href="#" className="hover:text-natural-600 transition-colors">ISO Standards</a></li>
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'admin' }))} className="hover:text-gold-500 transition-colors text-left">Staff Portal</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-natural-600 mb-6 font-sans">Support</h4>
            <ul className="space-y-3 text-xs uppercase tracking-widest font-bold text-natural-400 font-sans">
              <li><a href="#" className="hover:text-natural-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-natural-600 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-natural-600 transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-natural-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-[0.2em] text-natural-300">
          <div className="flex gap-8">
            <span>© {new Date().getFullYear()} TestOne Global Ltd.</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-natural-500 rounded-full"></div>
              <span>FDA Registered</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Facebook className="w-4 h-4 hover:text-natural-500 cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-natural-500 cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 hover:text-natural-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
