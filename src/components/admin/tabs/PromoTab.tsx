import React from 'react';
import { Sparkles, Timer, Percent, Truck, RotateCcw } from 'lucide-react';

export default function PromoTab() {
  const resetPromoSession = () => {
    sessionStorage.removeItem('test_one_promo_seen');
    alert('Promo session cleared. Refresh the storefront to see the launch popup again.');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-gray-900">Promotions & Launch</h3>
        <p className="text-sm text-gray-500 mt-1">Matches the live storefront inaugural offer (TESTONE20)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gold-600 to-amber-500 rounded-2xl p-6 text-white">
          <Sparkles className="w-8 h-8 mb-4 opacity-90" />
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Active code</p>
          <p className="text-3xl font-mono font-black mt-1">TESTONE20</p>
          <p className="text-sm mt-3 opacity-90">20% off first order OR free delivery on orders up to ₹1,000</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-gold-600" />
            <div>
              <p className="font-bold text-gray-900">Startup loader</p>
              <p className="text-xs text-gray-500">1.5 seconds fixed duration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Percent className="w-5 h-5 text-gold-600" />
            <div>
              <p className="font-bold text-gray-900">Launch popup</p>
              <p className="text-xs text-gray-500">Opens after loader; auto-closes in 2 seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-gold-600" />
            <div>
              <p className="font-bold text-gray-900">Smart alternatives</p>
              <p className="text-xs text-gray-500">Suggests Test One when competitor items are added to cart</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={resetPromoSession}
        className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gold-600 transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Reset promo popup for testing
      </button>
    </div>
  );
}
