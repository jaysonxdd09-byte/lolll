import React, { useState, useEffect } from 'react';
import { pb } from '../../../lib/pbClient';
import { Eye } from 'lucide-react';
import { formatINR } from '../../../lib/formatCurrency';

export default function OrdersTab({ userRole }: { userRole: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const handleUpdate = () => fetchOrders();
    window.addEventListener('orders-updated', handleUpdate);
    return () => window.removeEventListener('orders-updated', handleUpdate);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Failsafe timeout
      const timeoutId = setTimeout(() => setLoading(false), 3000);
      
      const data = await pb.collection('orders').getFullList({
        sort: '-created'
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await pb.collection('orders').update(id, { status: newStatus });
    fetchOrders();
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h3 className="text-2xl font-serif text-gray-900 mb-6">Order Management</h3>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{order.id.slice(0, 8)}...</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium">{formatINR(order.total_amount || 0)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-gold-500 focus:border-gold-500 block w-full p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gold-600 transition-colors"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
