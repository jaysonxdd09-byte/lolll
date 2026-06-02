import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, Percent, Truck, RotateCcw, Save, CheckCircle, Clock, ShoppingCart, RefreshCw } from 'lucide-react';

interface PromoConfig {
  code: string;
  discountPercent: number;
  delayMs: number;
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
}

const STORAGE_KEY = 'testone_promo_config';

const DEFAULT_CONFIG: PromoConfig = {
  code: 'TESTONE20',
  discountPercent: 20,
  delayMs: 8000,
  enabled: true,
  title: 'Test One Solutions',
  subtitle: 'Exclusive Inaugural Offer',
  description: 'Enjoy premium medical equipment with free delivery on all orders or get an extra 20% OFF on your very first order!',
};

function getConfig(): PromoConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_CONFIG };
}

function saveConfig(c: PromoConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  localStorage.setItem('testone_promo_updated', Date.now().toString());
}

export default function PromoTab() {
  const [config, setConfig] = useState<PromoConfig>(getConfig());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<PromoConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    setSaving(true);
    saveConfig(config);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 300);
  };

  const resetPromoSession = () => {
    sessionStorage.removeItem('test_one_promo_seen');
    alert('Promo session cleared. The popup will show again on next page load.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-500" />
            Promotions & Launch Popup
          </h3>
          <p className="text-sm text-gray-500 mt-1">Configure the 20% off inaugural offer popup shown to new visitors</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetPromoSession}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Popup
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-600 to-amber-500 rounded-2xl p-5 text-white">
          <Sparkles className="w-6 h-6 mb-3 opacity-90" />
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Promo Code</p>
          <p className="text-2xl font-mono font-black mt-1">{config.code}</p>
          <p className="text-xs mt-2 opacity-90">{config.discountPercent}% off + free shipping</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <Timer className="w-6 h-6 text-blue-600 mb-3" />
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Popup Delay</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{(config.delayMs / 1000).toFixed(0)}s</p>
          <p className="text-xs text-blue-500 mt-1">After page load</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <Percent className="w-6 h-6 text-green-600 mb-3" />
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Discount</p>
          <p className="text-2xl font-black text-green-700 mt-1">{config.discountPercent}%</p>
          <p className="text-xs text-green-500 mt-1">Off first order</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <ShoppingCart className="w-6 h-6 text-purple-600 mb-3" />
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Status</p>
          <p className={`text-2xl font-black mt-1 ${config.enabled ? 'text-green-700' : 'text-red-500'}`}>
            {config.enabled ? 'Active' : 'Paused'}
          </p>
          <p className="text-xs text-purple-500 mt-1">Popup is {config.enabled ? 'visible to users' : 'hidden'}</p>
        </div>
      </div>

      {/* Editable Settings */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Popup Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Promo Code</label>
            <input value={config.code} onChange={e => update({ code: e.target.value.toUpperCase() })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-mono font-bold focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount (%)</label>
            <input type="number" min="0" max="100" value={config.discountPercent} onChange={e => update({ discountPercent: parseInt(e.target.value) || 0 })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Popup Delay (seconds)</label>
            <div className="relative">
              <input type="number" min="1" max="60" value={config.delayMs / 1000}
                onChange={e => update({ delayMs: (parseInt(e.target.value) || 8) * 1000 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-2 col-span-full">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Popup Title</label>
            <input value={config.title} onChange={e => update({ title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
          </div>
          <div className="space-y-2 col-span-full">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea rows={2} value={config.description} onChange={e => update({ description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
            <button
              onClick={() => update({ enabled: !config.enabled })}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                config.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {config.enabled ? '● Active' : '○ Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          Preview
        </h3>
        <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden border border-primary-500/30 shadow-xl">
          <div className="h-36 bg-gradient-to-br from-primary-700 via-primary-500 to-amber-600 flex items-center justify-center text-center text-white px-6">
            <div>
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary-100 animate-pulse" />
              <h3 className="text-xl font-serif font-black">{config.title}</h3>
              <p className="text-[9px] text-primary-100 uppercase tracking-[0.25em] font-semibold mt-1">{config.subtitle}</p>
            </div>
          </div>
          <div className="p-6 text-center space-y-4">
            <h4 className="text-base font-bold text-gray-900">Get Flat {config.discountPercent}% OFF!</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{config.description}</p>
            <div className="bg-gradient-to-r from-primary-50 to-amber-50/50 rounded-2xl p-4 border border-primary-200/60">
              <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest mb-1.5">Your Code</p>
              <span className="font-mono font-black text-lg tracking-wider text-primary-950 bg-white border border-primary-300/80 px-4 py-1.5 rounded-lg shadow-sm inline-block">
                {config.code}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Popup will appear {config.enabled ? `${config.delayMs / 1000} seconds after page load` : '— disabled'}
        </p>
      </div>
    </div>
  );
}

