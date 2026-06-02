import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Loader2, Truck, Shield, Tag, ChevronRight, Lock } from 'lucide-react';
import { Product } from '../data/products';
import { db } from '../lib/dbClient';
import CheckoutForm, { ShippingDetails } from './CheckoutForm';
import { formatINR } from '../lib/formatCurrency';
import { getGstRate, getFreeShippingThreshold } from '../lib/shippingConfig';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  user?: any;
  onCheckoutComplete?: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, user, onCheckoutComplete }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [deliveryCity, setDeliveryCity] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  // Group items by product
  const itemMap = new Map<string, CartItem>();
  items.forEach(item => {
    if (itemMap.has(item.id)) {
      itemMap.get(item.id)!.quantity += 1;
    } else {
      itemMap.set(item.id, { product: item, quantity: 1 });
    }
  });
  const cartItems = Array.from(itemMap.values());

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gstRate = getGstRate() / 100;
  const gstAmount = Math.round(subtotal * gstRate);
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0; // 10% off promo
  const freeShippingThreshold = getFreeShippingThreshold();
  const effectiveDelivery = subtotal >= freeShippingThreshold ? 0 : deliveryCharge;
  const grandTotal = subtotal + gstAmount + effectiveDelivery - promoDiscount;
  const savings = cartItems.reduce((sum, item) => {
    const mrp = (item.product as any).mrp ?? item.product.price;
    return sum + (mrp - item.product.price) * item.quantity;
  }, 0);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'SURG20' || code === 'TESTONE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      alert('Please sign in to checkout.');
      return;
    }
    if (cartItems.length === 0) return;
    setShowCheckoutForm(true);
  };

  // Called back from CheckoutForm once pincode is validated
  const handleDeliveryInfo = (charge: number, city: string) => {
    setDeliveryCharge(charge);
    setDeliveryCity(city);
  };

  const handleFinalCheckout = async (details: ShippingDetails) => {
    setIsCheckingOut(true);
    try {
      const fullAddress = `${details.address}, ${details.city}, ${details.state} - ${details.pincode}`;
      const amount = Math.round(grandTotal * 100);
      
      const options = {
        key: "rzp_live_St7W7WbVL4nwWL",
        amount,
        currency: "INR",
        name: "Test One Solutions India",
        description: `Order for ${cartItems.length} item(s)`,
        image: "/images/logo/logo.png",
        handler: async function (response: any) {
          // Payment successful - now create the order
          try {
            const orderData = await db.collection('orders').create({
              user_id: user.id,
              customer_name: details.fullName,
              email: user.email,
              total_amount: grandTotal,
              subtotal,
              gst_amount: gstAmount,
              delivery_charge: effectiveDelivery,
              promo_discount: promoDiscount,
              status: 'Paid',
              shipping_address: fullAddress,
              phone: details.phone,
              payment_id: response.razorpay_payment_id
            });

            // Create order items
            const createItemPromises = cartItems.map(item =>
              db.collection('order_items').create({
                order_id: orderData.id,
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.price
              })
            );
            await Promise.all(createItemPromises);

            alert("Payment Successful! Order ID: " + orderData.id);
            setShowCheckoutForm(false);
            onCheckoutComplete?.(); // Parent clears cart and redirects
          } catch (err) {
            console.error('Order creation error:', err);
            alert("Payment received but order creation failed. Please contact support with Payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: { name: details.fullName, email: user?.email || "", contact: details.phone },
        theme: { color: "#B8860B" },
      };

      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          alert('Payment Failed: ' + resp.error.description + '. Please try again.');
          // Order is NOT created - user can retry
        });
        rzp.open();
      } else {
        // Fallback for development/testing without Razorpay script
        setTimeout(async () => {
          try {
            const mockPaymentId = 'mock_pay_' + Math.random().toString(36).substr(2, 9);
            const orderData = await db.collection('orders').create({
              user_id: user.id,
              customer_name: details.fullName,
              email: user.email,
              total_amount: grandTotal,
              subtotal,
              gst_amount: gstAmount,
              delivery_charge: effectiveDelivery,
              promo_discount: promoDiscount,
              status: 'Paid',
              shipping_address: fullAddress,
              phone: details.phone,
              payment_id: mockPaymentId
            });

            const createItemPromises = cartItems.map(item =>
              db.collection('order_items').create({
                order_id: orderData.id,
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.price
              })
            );
            await Promise.all(createItemPromises);

            alert('Payment Successful (Sandbox)! Order ID: ' + orderData.id);
            setShowCheckoutForm(false);
            onCheckoutComplete?.();
          } catch (err) {
            console.error('Sandbox order error:', err);
            alert('Order creation failed. Please try again.');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200]">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-serif text-gray-900">Your Cart</h2>
                <span className="bg-primary-50 text-primary-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-lg font-serif text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-400 max-w-xs">Browse our catalog and add products to get started.</p>
                <button onClick={onClose} className="mt-8 bg-primary-500 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {cartItems.map((item) => {
                    const mrp = (item.product as any).mrp ?? item.product.price;
                    const hasDiscount = mrp > item.product.price;
                    const discountPct = hasDiscount ? Math.round(((mrp - item.product.price) / mrp) * 100) : 0;
                    return (
                      <motion.div
                        key={item.product.id} layout
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100 }}
                        className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                          <img src={item.product.image} alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=200'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">{item.product.name}</h4>
                          <p className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">{item.product.brand}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-100 p-0.5">
                              <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50 text-gray-400">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-gray-900 min-w-[16px] text-center">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50 text-gray-400">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-gray-900">{formatINR(item.product.price * item.quantity)}</span>
                              {hasDiscount && (
                                <div className="flex items-center gap-1 justify-end">
                                  <span className="text-[9px] text-gray-400 line-through">{formatINR(mrp * item.quantity)}</span>
                                  <span className="text-[9px] font-bold text-green-600">{discountPct}% off</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => onRemove(item.product.id)} className="self-start p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-700">Order Summary</h3>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                    <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
                  </div>

                  {/* Savings badge */}
                  {savings > 0 && (
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                      <Tag className="w-3 h-3 text-green-600" />
                      <span className="text-[10px] font-bold text-green-700">You save {formatINR(Math.round(savings))} on this order</span>
                    </div>
                  )}

                  {/* Promo code */}
                  <div>
                    <button onClick={() => setShowPromo(!showPromo)} className="text-[10px] font-bold text-primary-600 underline underline-offset-2 hover:text-primary-700 transition-colors">
                      Have a promo code?
                    </button>
                    {showPromo && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(''); setPromoApplied(false); }}
                          placeholder="Enter code"
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none uppercase"
                        />
                        <button onClick={handleApplyPromo} className="bg-primary-500 text-white px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-primary-600 transition-all">
                          Apply
                        </button>
                      </div>
                    )}
                    {promoApplied && <p className="text-[10px] text-green-600 font-bold mt-1">✓ Promo applied — 10% off!</p>}
                    {promoError && <p className="text-[10px] text-red-500 mt-1">{promoError}</p>}
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    {/* Subtotal row */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal (INR)</span>
                      <span className="text-primary-600 font-bold">{formatINR(subtotal)}</span>
                    </div>

                    {/* GST */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>GST ({getGstRate()}% on medical devices)</span>
                      <span>+ {formatINR(gstAmount)}</span>
                    </div>

                    {/* Delivery */}
                    <div className="flex justify-between text-xs text-gray-500 items-center">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Delivery {deliveryCity ? `to ${deliveryCity}` : ''}
                      </span>
                      {subtotal >= getFreeShippingThreshold() ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : effectiveDelivery === 0 ? (
                        <span className="text-gray-400 text-[10px]">Enter pincode</span>
                      ) : (
                        <span>+ {formatINR(effectiveDelivery)}</span>
                      )}
                    </div>

                    {/* Free shipping progress */}
                    {subtotal < getFreeShippingThreshold() && (
                      <div className="space-y-1">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((subtotal / getFreeShippingThreshold()) * 100, 100)}%` }} />
                        </div>
                        <p className="text-[9px] text-gray-400">Add {formatINR(getFreeShippingThreshold() - subtotal)} more for <span className="text-green-600 font-bold">FREE delivery</span></p>
                      </div>
                    )}

                    {/* Promo discount */}
                    {promoApplied && (
                      <div className="flex justify-between text-xs text-green-600 font-bold">
                        <span>Promo discount</span>
                        <span>− {formatINR(promoDiscount)}</span>
                      </div>
                    )}

                    {/* Grand Total */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-wide">Total</span>
                      <span className="text-xl font-black text-primary-600">{formatINR(grandTotal)}</span>
                    </div>
                    <p className="text-[9px] text-gray-400">Inclusive of all taxes and delivery charges</p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCheckoutClick}
                    disabled={isCheckingOut}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Secure Checkout — {formatINR(grandTotal)}
                      </>
                    )}
                  </button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      <Shield className="w-3 h-3 text-green-500" />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      <Truck className="w-3 h-3 text-blue-400" />
                      Pan India Delivery
                    </div>
                  </div>
                  <p className="text-center text-[9px] text-gray-400">We accept UPI, Cards, Net Banking & Wallets</p>

                  <button onClick={onClose} className="w-full text-center text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors py-1">
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      <CheckoutForm
        isOpen={showCheckoutForm}
        onClose={() => setShowCheckoutForm(false)}
        onSubmit={handleFinalCheckout}
        totalAmount={grandTotal}
        subtotal={subtotal}
        gstAmount={gstAmount}
        onDeliveryInfo={handleDeliveryInfo}
      />
    </AnimatePresence>
  );
};

export default CartSidebar;
