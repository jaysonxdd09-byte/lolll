import React, { useEffect, useState } from 'react';
import { pb } from '../../../lib/pbClient';
import { Package, ShoppingBag, IndianRupee, Users, Sparkles, Layers } from 'lucide-react';
import { formatINR } from '../../../lib/formatCurrency';
import { getCatalogStats } from '../../../lib/adminProducts';

export default function OverviewTab() {
  const catalog = getCatalogStats();
  const [stats, setStats] = useState({
    totalOrders: 0,
    outOfStock: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          pb.collection('orders').getFullList({ fields: 'total_amount' }),
          pb.collection('products').getFullList({ filter: 'stock_quantity = 0', fields: 'id' }),
          pb.collection('users').getList(1, 1, { fields: 'id' }),
        ]);

        const revenue =
          ordersRes.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;

        setStats({
          totalOrders: ordersRes.length,
          outOfStock: productsRes.length,
          totalRevenue: revenue,
          totalUsers: usersRes.totalItems || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Catalog Products', value: catalog.total, sub: `${catalog.testOneCount} Test One · ${catalog.competitorCount} competitors`, icon: Package, color: 'gold' },
    { label: 'Categories', value: catalog.categoryCount, sub: 'Drapes, gowns, kits, tapes & more', icon: Layers, color: 'blue' },
    { label: 'Total Orders', value: stats.totalOrders, sub: 'From checkout & cart', icon: ShoppingBag, color: 'emerald' },
    { label: 'Revenue', value: formatINR(stats.totalRevenue), sub: 'Order totals (INR)', icon: IndianRupee, color: 'purple' },
    { label: 'Low Stock (catalog)', value: catalog.lowStockCount, sub: `${catalog.outOfStockCount} out of stock`, icon: Package, color: 'rose' },
    { label: 'Registered Users', value: stats.totalUsers, sub: 'Customer & staff accounts', icon: Users, color: 'slate' },
  ];

  const colorMap: Record<string, string> = {
    gold: 'bg-gold-50 text-gold-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-gray-900">Dashboard Overview</h3>
        <p className="text-sm text-gray-500 mt-1">Test One Medical Solutions — live storefront catalog & operations</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[card.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-gold-50 to-amber-50 rounded-2xl border border-gold-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-gold-600" />
          <h4 className="font-bold text-gray-900">Active storefront promo</h4>
        </div>
        <p className="text-sm text-gray-600"><strong>TESTONE20</strong> — 20% off or free delivery on orders up to ₹1,000. Launch popup auto-closes in 2s; loader runs 1.5s.</p>
      </div>

    </div>
  );
}
