import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/dbClient';
import { Eye, X, Package, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../../lib/formatCurrency';

type OrderTab = 'pending' | 'completed';

export default function OrdersTab({ userRole }: { userRole: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderTab>('pending');
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    fetchOrders();

    const handleUpdate = () => fetchOrders();
    window.addEventListener('orders-updated', handleUpdate);
    return () => window.removeEventListener('orders-updated', handleUpdate);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const timeoutId = setTimeout(() => setLoading(false), 3000);
      
      // Only fetch orders that have been paid (have payment_id)
      const data = await db.collection('orders').getFullList({
        sort: '-created',
        filter: 'payment_id != ""'
      });
      clearTimeout(timeoutId);
      
      const mappedData = data.map(item => ({
        ...item,
        created_at: item.created,
        updated_at: item.updated
      }));
      setOrders(mappedData);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on active tab
  const pendingOrders = orders.filter(order => 
    order.status?.toLowerCase() !== 'delivered'
  );
  const completedOrders = orders.filter(order => 
    order.status?.toLowerCase() === 'delivered'
  );

  const displayedOrders = activeTab === 'pending' ? pendingOrders : completedOrders;

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await db.collection('orders').update(id, { status: newStatus });
    fetchOrders();
  };

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
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
      setOrderItems(itemsWithProducts);
    } catch (err) {
      console.error('Error fetching order items:', err);
      setOrderItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'paid':
        return 'bg-red-50 text-red-700 border-red-200 font-extrabold focus:ring-red-500 focus:border-red-500';
      case 'shipped':
        return 'bg-orange-50 text-orange-700 border-orange-200 font-extrabold focus:ring-orange-500 focus:border-orange-500';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200 font-extrabold focus:ring-green-500 focus:border-green-500';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-primary-500 focus:border-primary-500';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div>
      <h3 className="text-2xl font-serif text-gray-900 mb-6">Order Management</h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'pending'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Package className="w-4 h-4" />
          Pending Orders
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'pending' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
          }`}>
            {pendingOrders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'completed'
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Completed Orders
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'completed' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
          }`}>
            {completedOrders.length}
          </span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Order ID</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Customer</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Total</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {activeTab === 'pending' 
                    ? 'No pending orders. All orders have been delivered!' 
                    : 'No completed orders yet.'}
                </td>
              </tr>
            ) : displayedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-xs font-mono text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{formatINR(order.total_amount || 0)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className={`border text-xs rounded-lg block w-40 p-2 cursor-pointer transition-all outline-none font-bold uppercase tracking-wider ${getStatusStyles(order.status)}`}
                  >
                    <option value="Pending" className="bg-white text-red-700 font-bold">Pending</option>
                    <option value="Shipped" className="bg-white text-orange-700 font-bold">Shipped</option>
                    <option value="Delivered" className="bg-white text-green-700 font-bold">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleViewOrder(order)}
                    className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    title="View Order Details"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500 block">Order Viewer</span>
                <h3 className="text-2xl font-serif text-gray-900 mt-1">Order Details #{selectedOrder.id.slice(-8).toUpperCase()}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 flex-1">
              
              {/* Grid 1: Basic Info & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Details</p>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedOrder.customer_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.phone}</p>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</p>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">{selectedOrder.shipping_address}</p>
                </div>
              </div>

              {/* Grid 2: Dates & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Order Date</p>
                  <p className="text-xs font-semibold text-gray-900 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
                  <p className="text-xs font-semibold text-primary-600 mt-1">{selectedOrder.payment_id ? 'Razorpay Online' : 'Pending Payment'}</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active Status</p>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border mt-1.5 ${
                    selectedOrder.status?.toLowerCase() === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                    selectedOrder.status?.toLowerCase() === 'shipped' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Purchased Products</p>
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  {loadingItems ? (
                    <div className="p-8 text-center text-xs text-gray-400">Loading purchased items...</div>
                  ) : orderItems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">No items found in this order.</div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                        <tr>
                          <th className="px-5 py-3 font-bold">Item Name</th>
                          <th className="px-5 py-3 font-bold text-center">Qty</th>
                          <th className="px-5 py-3 font-bold text-right">Unit Price</th>
                          <th className="px-5 py-3 font-bold text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-gray-900">{item.product?.name || 'Medical Supply'}</p>
                              {item.product?.code && <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.product.code}</p>}
                            </td>
                            <td className="px-5 py-3.5 text-center font-bold text-gray-700">{item.quantity}</td>
                            <td className="px-5 py-3.5 text-right text-gray-500">{formatINR(item.unit_price || 0)}</td>
                            <td className="px-5 py-3.5 text-right font-bold text-gray-900">{formatINR((item.unit_price || 0) * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Payment Details info (if Paid) */}
              {selectedOrder.payment_id && (
                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100/50 p-4">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Razorpay Transaction Reference</p>
                  <p className="font-mono text-xs text-emerald-800 mt-1 select-all">{selectedOrder.payment_id}</p>
                </div>
              )}

              {/* Total Summary Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 bg-white">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Charged</span>
                <span className="text-2xl font-serif font-bold text-primary-600">{formatINR(selectedOrder.total_amount || 0)}</span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
