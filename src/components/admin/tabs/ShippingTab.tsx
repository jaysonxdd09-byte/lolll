import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Truck, Percent, MapPin, RefreshCw, DollarSign, PackageCheck, CheckCircle, AlertTriangle, IndianRupee, Gauge } from 'lucide-react';
import { getShippingConfig, saveShippingConfig, ShippingConfig, ALL_STATES_AND_UTS, StateDeliveryRate } from '../../../lib/shippingConfig';
import { formatINR } from '../../../lib/formatCurrency';

const ShippingTab: React.FC = () => {
  const [config, setConfig] = useState<ShippingConfig>(getShippingConfig());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingState, setEditingState] = useState<string | null>(null);

  // Reload config when tab becomes visible
  useEffect(() => {
    setConfig(getShippingConfig());
    const h = () => setConfig(getShippingConfig());
    window.addEventListener('storage', h);
    return () => window.removeEventListener('storage', h);
  }, []);

  const handleGstChange = (val: string) => {
    const v = parseFloat(val);
    if (!isNaN(v) && v >= 0 && v <= 100) {
      setConfig(prev => ({ ...prev, gstRate: v }));
    }
  };

  const handleThresholdChange = (val: string) => {
    const v = parseInt(val);
    if (!isNaN(v) && v >= 0) {
      setConfig(prev => ({ ...prev, freeShippingThreshold: v }));
    }
  };

  const handleStateChargeChange = (state: string, val: string) => {
    const v = parseInt(val);
    if (!isNaN(v) && v >= 0) {
      setConfig(prev => ({
        ...prev,
        stateRates: prev.stateRates.map(r =>
          r.state === state ? { ...r, charge: v } : r
        ),
      }));
    }
  };

  const handleStateDaysChange = (state: string, val: string) => {
    setConfig(prev => ({
      ...prev,
      stateRates: prev.stateRates.map(r =>
        r.state === state ? { ...r, estimatedDays: val } : r
      ),
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Reset all shipping charges and GST to default values?')) {
      const def: ShippingConfig = {
        gstRate: 5,
        freeShippingThreshold: 5000,
        stateRates: [...ALL_STATES_AND_UTS],
      };
      setConfig(def);
      saveShippingConfig(def);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSave = () => {
    setSaving(true);
    saveShippingConfig(config);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  };

  const filteredStates = config.stateRates.filter(r =>
    r.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    freeCount: config.stateRates.filter(r => r.charge === 0).length,
    avgCharge: Math.round(config.stateRates.reduce((s, r) => s + r.charge, 0) / config.stateRates.length),
    maxCharge: Math.max(...config.stateRates.map(r => r.charge)),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary-500" />
            Shipping & Tax Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage GST rates and delivery charges for all Indian states and union territories</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4 text-green-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <Percent className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl font-black text-blue-700">{config.gstRate}%</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">GST Rate</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <IndianRupee className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-2xl font-black text-green-700">{formatINR(config.freeShippingThreshold)}</p>
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Free Shipping Above</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <MapPin className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-2xl font-black text-purple-700">{config.stateRates.length}</p>
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">States/UTs Covered</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <Gauge className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-2xl font-black text-amber-700">{formatINR(stats.avgCharge)}</p>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Avg Delivery Charge</p>
        </div>
      </div>

      {/* GST & Free Shipping Threshold */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Global Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
              <Percent className="w-3 h-3" /> GST Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={config.gstRate}
                onChange={e => handleGstChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
            </div>
            <p className="text-[10px] text-gray-400">Applied to all product prices as a surcharge</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
              <PackageCheck className="w-3 h-3" /> Free Shipping Threshold (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="100"
                value={config.freeShippingThreshold}
                onChange={e => handleThresholdChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
            </div>
            <p className="text-[10px] text-gray-400">Orders above this amount get free delivery</p>
          </div>
        </div>
      </div>

      {/* State-wise Delivery Charges */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              State & Union Territory Delivery Charges
            </h3>
            <p className="text-xs text-gray-400 mt-1">Set custom delivery charge and estimated days for each region</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search state or UT..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">State / Union Territory</th>
                <th className="text-center px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Charge (₹)</th>
                <th className="text-center px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((rate, idx) => (
                <motion.tr
                  key={rate.state}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`border-b border-gray-50 hover:bg-primary-50/30 transition-colors ${
                    rate.charge === 0 ? 'bg-green-50/40' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-xs text-gray-400 font-mono">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${rate.charge === 0 ? 'bg-green-500' : rate.charge <= 60 ? 'bg-blue-500' : rate.charge <= 100 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium text-gray-900">{rate.state}</span>
                      {rate.charge === 0 && (
                        <span className="bg-green-100 text-green-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">Free</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingState === rate.state ? (
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs text-gray-400">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={rate.charge}
                          onChange={e => handleStateChargeChange(rate.state, e.target.value)}
                          onBlur={() => setEditingState(null)}
                          autoFocus
                          className="w-20 text-center bg-white border border-primary-500 rounded-lg py-1.5 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingState(rate.state)}
                        className="text-sm font-bold text-gray-900 hover:text-primary-600 cursor-pointer px-3 py-1 rounded-lg hover:bg-primary-50 transition-all"
                      >
                        {formatINR(rate.charge)}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select
                        value={rate.estimatedDays}
                        onChange={e => handleStateDaysChange(rate.state, e.target.value)}
                        className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none cursor-pointer"
                      >
                        <option>1-2 days</option>
                        <option>2-3 days</option>
                        <option>2-4 days</option>
                        <option>3-5 days</option>
                        <option>4-7 days</option>
                        <option>5-8 days</option>
                        <option>7-10 days</option>
                        <option>7-12 days</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredStates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <AlertTriangle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No states match "{searchQuery}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[10px] text-gray-400">
          <span>Click on any delivery charge value to edit it directly</span>
          <span className="font-bold">{config.stateRates.length} regions</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingTab;
