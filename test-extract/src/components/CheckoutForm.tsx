import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, CreditCard, Loader2, CheckCircle, AlertCircle, Truck, ShieldCheck, Package } from 'lucide-react';
import { formatINR } from '../lib/formatCurrency';
import { checkPincode } from '../lib/pincodeZones';
import { getGstRate, getFreeShippingThreshold } from '../lib/shippingConfig';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ShippingDetails) => void;
  totalAmount: number;
  subtotal?: number;
  gstAmount?: number;
  onDeliveryInfo?: (charge: number, city: string) => void;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface FieldError {
  phone?: string;
  pincode?: string;
  city?: string;
  state?: string;
  fullName?: string;
  address?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen, onClose, onSubmit, totalAmount, subtotal = 0, gstAmount = 0, onDeliveryInfo
}) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [pincodeInfo, setPincodeInfo] = useState<{ deliveryCharge: number; estimatedDays: string; zone: string } | null>(null);
  const [pincodeChecking, setPincodeChecking] = useState(false);

  // Validate phone: exactly 10 digits, Indian format
  const validatePhone = (phone: string): string | undefined => {
    const digits = phone.replace(/\D/g, '');
    if (!digits) return 'Phone number is required';
    if (digits.length !== 10) return 'Enter a valid 10-digit mobile number';
    if (!/^[6-9]/.test(digits)) return 'Mobile number must start with 6, 7, 8, or 9';
    return undefined;
  };

  // Auto-check pincode and fill city/state
  useEffect(() => {
    const pin = formData.pincode.trim();
    if (pin.length !== 6) {
      setPincodeStatus('idle');
      setPincodeInfo(null);
      return;
    }

    setPincodeChecking(true);
    // Small debounce
    const t = setTimeout(() => {
      const info = checkPincode(pin);
      if (!info) {
        setPincodeStatus('invalid');
        setPincodeInfo(null);
        setErrors(prev => ({ ...prev, pincode: 'Invalid pincode. Please enter a valid 6-digit Indian pincode.' }));
        setPincodeChecking(false);
        return;
      }

      setPincodeStatus('valid');
      setPincodeInfo({ deliveryCharge: info.deliveryCharge, estimatedDays: info.estimatedDays, zone: info.zone });
      setErrors(prev => { const e = { ...prev }; delete e.pincode; delete e.city; delete e.state; return e; });

      // Auto-fill city and state if found
      setFormData(prev => ({
        ...prev,
        city: info.city || prev.city,
        state: info.state || prev.state,
      }));

      onDeliveryInfo?.(info.deliveryCharge, info.city || '');
      setPincodeChecking(false);
    }, 400);

    return () => clearTimeout(t);
  }, [formData.pincode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Phone: only allow digits, limit to 10
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digits }));
      const err = validatePhone(digits);
      setErrors(prev => ({ ...prev, phone: err }));
      return;
    }
    // Pincode: only digits, limit to 6
    if (name === 'pincode') {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, pincode: digits }));
      setErrors(prev => { const e = { ...prev }; delete e.pincode; return e; });
      return;
    }
    // Name: only letters and spaces
    if (name === 'fullName') {
      const cleaned = value.replace(/[^a-zA-Z\s.]/g, '');
      setFormData(prev => ({ ...prev, fullName: cleaned }));
      setErrors(prev => ({ ...prev, fullName: cleaned.trim().length < 3 ? 'Enter your full name (at least 3 characters)' : undefined }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors(prev => { const e = { ...prev }; delete (e as any)[name]; return e; });
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3)
      newErrors.fullName = 'Enter your full name (at least 3 characters)';

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (!formData.address.trim() || formData.address.trim().length < 10)
      newErrors.address = 'Enter a complete address (at least 10 characters)';

    if (!formData.city.trim())
      newErrors.city = 'City is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.city.trim()))
      newErrors.city = 'City name should contain only letters';

    if (!formData.state.trim())
      newErrors.state = 'State is required';

    if (pincodeStatus === 'invalid' || formData.pincode.length !== 6)
      newErrors.pincode = 'Enter a valid 6-digit Indian pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 600);
  };

  const deliveryCharge = pincodeInfo?.deliveryCharge ?? 0;
  const freeShippingThreshold = getFreeShippingThreshold();
  const freeShipping = subtotal >= freeShippingThreshold;
  const effectiveDelivery = freeShipping ? 0 : deliveryCharge;
  const grandTotal = subtotal + gstAmount + effectiveDelivery;

  const inputClass = (field: keyof FieldError) =>
    `w-full bg-gray-50 border rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 outline-none transition-all ${
      errors[field]
        ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
        : pincodeStatus === 'valid' && field === 'pincode'
          ? 'border-green-400 focus:ring-green-500/20 focus:border-green-500'
          : 'border-gray-100 focus:ring-primary-500/20 focus:border-primary-500'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Shipping Details</h2>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" /> Secure & Verified Checkout
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
              {/* Left: Form */}
              <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required
                      placeholder="e.g. Rahul Sharma"
                      className={inputClass('fullName')} />
                  </div>
                  {errors.fullName && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input name="phone" value={formData.phone} onChange={handleChange} required
                      placeholder="10-digit mobile number" maxLength={10} inputMode="numeric"
                      className={inputClass('phone')} />
                    {formData.phone.length === 10 && !errors.phone && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Address *</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows={3}
                      placeholder="House/Flat No., Building, Street, Area, Landmark"
                      className={`w-full bg-gray-50 border rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 outline-none transition-all resize-none ${errors.address ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-100 focus:ring-primary-500/20 focus:border-primary-500'}`}
                    />
                  </div>
                  {errors.address && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                </div>

                {/* Pincode — first, auto-fills city & state */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode *</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input name="pincode" value={formData.pincode} onChange={handleChange} required
                      placeholder="6-digit pincode" maxLength={6} inputMode="numeric"
                      className={inputClass('pincode')} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {pincodeChecking && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                      {!pincodeChecking && pincodeStatus === 'valid' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {!pincodeChecking && pincodeStatus === 'invalid' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  {errors.pincode && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.pincode}</p>}
                  {pincodeStatus === 'valid' && pincodeInfo && (
                    <div className="flex items-center gap-2 ml-1">
                      <Truck className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] text-blue-600 font-bold">
                        Delivery in {pincodeInfo.estimatedDays} —&nbsp;
                        {freeShipping ? (
                          <span className="text-green-600">FREE</span>
                        ) : pincodeInfo.deliveryCharge === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span>₹{pincodeInfo.deliveryCharge}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* City & State — auto-filled from pincode, editable */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City *</label>
                    <input name="city" value={formData.city} onChange={handleChange} required
                      placeholder="City"
                      className={`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-sm focus:bg-white focus:ring-2 outline-none transition-all ${errors.city ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-100 focus:ring-primary-500/20 focus:border-primary-500'}`}
                    />
                    {errors.city && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.city}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State *</label>
                    <input name="state" value={formData.state} onChange={handleChange} required
                      placeholder="State"
                      className={`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-sm focus:bg-white focus:ring-2 outline-none transition-all ${errors.state ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-100 focus:ring-primary-500/20 focus:border-primary-500'}`}
                    />
                    {errors.state && <p className="text-[10px] text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.state}</p>}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <><ShieldCheck className="w-4 h-4" /> Confirm & Pay {formatINR(grandTotal)}</>
                  )}
                </button>
              </form>

              {/* Right: Order Summary */}
              <div className="lg:w-72 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 p-6 flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary-500" /> Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST ({getGstRate()}%)</span>
                    <span>+ {formatINR(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 items-start">
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Delivery</span>
                    {pincodeStatus === 'valid' ? (
                      freeShipping ? (
                        <span className="text-green-600 font-bold text-xs">FREE</span>
                      ) : (
                        <span className="font-semibold">+ {formatINR(effectiveDelivery)}</span>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs">Enter pincode</span>
                    )}
                  </div>

                  {subtotal < getFreeShippingThreshold() && (
                    <p className="text-[10px] text-gray-400 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
                      Add {formatINR(getFreeShippingThreshold() - subtotal)} more for <span className="text-green-600 font-bold">free delivery</span>
                    </p>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-black text-gray-900 uppercase text-xs tracking-wide">Total</span>
                    <span className="text-xl font-black text-primary-600">{formatINR(grandTotal)}</span>
                  </div>
                  <p className="text-[9px] text-gray-400">Final amount incl. all taxes & delivery</p>
                </div>

                {/* Delivery info card */}
                {pincodeStatus === 'valid' && pincodeInfo && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-green-800">Delivery Available</span>
                    </div>
                    {formData.city && <p className="text-[10px] text-green-700">To: {formData.city}, {formData.state}</p>}
                    <p className="text-[10px] text-green-700 font-bold">Estimated: {pincodeInfo.estimatedDays}</p>
                  </div>
                )}

                {/* Trust section */}
                <div className="mt-auto space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                    <ShieldCheck className="w-4 h-4 text-green-500" /> 100% Secure Payment
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                    <Truck className="w-4 h-4 text-blue-400" /> Pan India Delivery
                  </div>
                  <p className="text-[9px] text-gray-400">UPI · Cards · Net Banking · Wallets</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutForm;
