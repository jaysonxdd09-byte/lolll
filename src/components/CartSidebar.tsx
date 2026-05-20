import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { Product } from '../data/products';
import { pb } from '../lib/pbClient';
import CheckoutForm, { ShippingDetails } from './CheckoutForm';

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

  // Group items by product
  const groupedItems: CartItem[] = [];
  const itemMap = new Map<string, CartItem>();
  
  items.forEach(item => {
    if (itemMap.has(item.id)) {
      itemMap.get(item.id)!.quantity += 1;
    } else {
      const cartItem = { product: item, quantity: 1 };
      itemMap.set(item.id, cartItem);
      groupedItems.push(cartItem);
    }
  });

  // Rebuild from map for correct quantities
  const cartItems = Array.from(itemMap.values());
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    if (!user) {
      alert('Please sign in to checkout.');
      return;
    }
    if (cartItems.length === 0) return;
    setShowCheckoutForm(true);
  };

  const handleFinalCheckout = async (details: ShippingDetails) => {
    setIsCheckingOut(true);
    try {
      // 1. Create order
      const fullAddress = `${details.address}, ${details.city}, ${details.state} - ${details.pincode}`;
      const orderData = await pb.collection('orders').create({
        user_id: user.id,
        customer_name: details.fullName,
        email: user.email,
        total_amount: totalPrice,
        status: 'Pending',
        shipping_address: fullAddress,
        phone: details.phone
      });

      // 2. Create order items
      const createItemPromises = cartItems.map(item =>
        pb.collection('order_items').create({
          order_id: orderData.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price
        })
      );

      await Promise.all(createItemPromises);

      // 3. Complete checkout
      setShowCheckoutForm(false);
      onCheckoutComplete?.();
      alert('Order placed successfully! We will contact you soon.');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="text-lg font-serif text-gray-900">Your Cart</h2>
                <span className="bg-gold-50 text-gold-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-lg font-serif text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-400 max-w-xs">Browse our catalog and add products to get started.</p>
                  <button
                    onClick={onClose}
                    className="mt-8 bg-gold-500 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{item.product.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors text-gray-400"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 min-w-[16px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors text-gray-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="self-start p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Subtotal</span>
                  <span className="text-2xl font-light text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-gray-400">Shipping and taxes calculated at checkout.</p>
                <button 
                  onClick={handleCheckoutClick}
                  disabled={isCheckingOut}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gold-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center disabled:opacity-50"
                >
                  {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Proceed to Checkout'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gold-600 transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      <CheckoutForm 
        isOpen={showCheckoutForm}
        onClose={() => setShowCheckoutForm(false)}
        onSubmit={handleFinalCheckout}
        totalAmount={totalPrice}
      />
    </AnimatePresence>
  );
};

export default CartSidebar;
