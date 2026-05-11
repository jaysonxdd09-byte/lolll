import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, CreditCard, ChevronRight, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ShippingDetails) => void;
  totalAmount: number;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ isOpen, onClose, onSubmit, totalAmount }) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate slight delay for premium feel
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Shipping Details</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Secure Checkout</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    required
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-gray-400 group-focus-within:text-gold-500 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House No., Building, Street Name, Area"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                  <input
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                <input
                  required
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="000 000"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                />
              </div>

              {/* Order Summary Hint */}
              <div className="bg-gold-50/50 p-4 rounded-2xl border border-gold-100/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-500 text-white rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">Total Amount</p>
                    <p className="text-lg font-serif text-gray-900">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-gold-600">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Proceed to Payment'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutForm;
