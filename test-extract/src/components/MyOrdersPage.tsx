import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { db } from '../lib/dbClient';
import BackButton from './BackButton';

interface Order {
  id: string;
  product_name: string;
  product_code?: string;
  quantity: number;
  total_amount: number;
  status: string;
  shipping_name: string;
  shipping_city: string;
  shipping_state: string;
  created_at: string;
  payment_id?: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:   { label: 'Pending',   color: 'text-red-600 border-red-200',  bg: 'bg-red-50', icon: Clock },
  paid:      { label: 'Paid',      color: 'text-emerald-600 border-emerald-200', bg: 'bg-emerald-50', icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: 'text-orange-600 border-orange-200',  bg: 'bg-orange-50', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600 border-green-200',   bg: 'bg-green-50',  icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 border-red-200',     bg: 'bg-red-50',    icon: XCircle },
};

const steps = ['pending', 'shipped', 'delivered'];

interface Props {
  onBack: () => void;
  userEmail?: string;
}

export default function MyOrdersPage({ onBack, userEmail }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await db.collection('orders').getFullList();
        
        const mine = userEmail
          ? allOrders.filter((o: any) => o.email?.toLowerCase() === userEmail.toLowerCase())
          : allOrders;
          
        const ordersWithItems = await Promise.all(mine.map(async (order: any) => {
          const items = await db.collection('order_items').getFullList({
            filter: `order_id = "${order.id}"`
          });
          
          const itemsWithProducts = await Promise.all(items.map(async (item: any) => {
            try {
              const product = await db.collection('products').getOne(item.product_id);
              return { ...item, product };
            } catch {
              return item;
            }
          }));
          
          return {
            id: order.id,
            product_name: itemsWithProducts.map(i => `${i.product?.name || 'Medical Supply'} (x${i.quantity})`).join(', ') || 'Medical Supplies',
            product_code: itemsWithProducts.map(i => i.product?.code).filter(Boolean).join(', ') || undefined,
            quantity: itemsWithProducts.reduce((sum, i) => sum + i.quantity, 0) || 1,
            total_amount: order.total_amount || 0,
            status: order.status || 'Pending',
            shipping_name: order.customer_name || 'Customer',
            shipping_city: order.shipping_address?.split(',')[1]?.trim() || 'City',
            shipping_state: order.shipping_address?.split(',')[2]?.split('-')[0]?.trim() || 'State',
            created_at: order.created || new Date().toISOString(),
            payment_id: order.payment_id
          };
        }));
        
        setOrders(ordersWithItems.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (err) {
        console.error('Error fetching my orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (selected) {
    const cfg = statusConfig[selected.status?.toLowerCase()] || statusConfig.pending;
    const StatusIcon = cfg.icon;
    const stepIndex = steps.indexOf(selected.status?.toLowerCase());

    return (
      <div className="pt-16 sm:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">
          <BackButton onBack={() => setSelected(null)} label="Back to Orders" className="mb-6" />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono font-bold text-sm">#{selected.id.slice(-8).toUpperCase()}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>
            </div>

            {/* Progress tracker */}
            {selected.status !== 'cancelled' && (
              <div className="px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
                  <div
                    className="absolute left-0 top-4 h-0.5 bg-primary-500 z-0 transition-all duration-700"
                    style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
                  />
                  {steps.map((step, i) => {
                    const done = i <= stepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                          {i + 1}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${done ? 'text-primary-600' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Product</p>
                  <p className="font-semibold text-gray-900">{selected.product_name}</p>
                  {selected.product_code && <p className="text-xs text-gray-400 font-mono">{selected.product_code}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Qty</p>
                  <p className="font-bold text-gray-900">{selected.quantity}</p>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Deliver To</p>
                  <p className="font-medium text-gray-900">{selected.shipping_name}</p>
                  <p className="text-sm text-gray-500">{selected.shipping_city}, {selected.shipping_state}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">{selected.status === 'Paid' ? 'Amount Paid' : 'Total'}</p>
                  <p className={`font-black text-lg ${selected.status === 'Paid' ? 'text-emerald-600' : 'text-primary-600'}`}>₹{selected.total_amount?.toLocaleString('en-IN')}</p>
                  {selected.status === 'Paid' && <p className="text-[10px] text-emerald-500 font-medium">✓ Payment Received</p>}
                </div>
              </div>

              {selected.payment_id && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400">Payment ID</p>
                  <p className="font-mono text-xs text-gray-700">{selected.payment_id}</p>
                </div>
              )}

              <p className="text-xs text-gray-400 text-right">
                Ordered on {new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <BackButton onBack={onBack} label="Back to Home" className="mb-6" />

        <div className="flex items-center gap-3 mb-8">
          <Package className="w-7 h-7 text-primary-600" />
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">No orders yet</h3>
            <p className="text-sm text-gray-400 mb-6">Your order history will appear here once you place an order.</p>
            <button onClick={onBack} className="bg-primary-500 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-600 transition-all">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const cfg = statusConfig[order.status?.toLowerCase()] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelected(order)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-snug">{order.product_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {order.quantity} · {order.shipping_city}, {order.shipping_state}
                        </p>
                        <p className="text-xs text-gray-300 mt-1 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-primary-600 text-base">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border mt-1 ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-3 text-right">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
