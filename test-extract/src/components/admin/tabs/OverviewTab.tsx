import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/dbClient';
import { Package, ShoppingBag, IndianRupee, Users, Sparkles, Layers, Truck, Percent, AlertTriangle } from 'lucide-react';
import { formatINR } from '../../../lib/formatCurrency';
import { getCatalogStats } from '../../../lib/adminProducts';
import { getShippingConfig } from '../../../lib/shippingConfig';

export default function OverviewTab() {
  const catalog = getCatalogStats();
  const shipping = getShippingConfig();
  const [stats, setStats] = useState({
    totalOrders: 0,
    outOfStock: 0,
    totalRevenue: 0,
    totalUsers: 0,
    paidOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          db.collection('orders').getFullList(),
          db.collection('products').getFullList({ filter: 'stock_quantity = 0', fields: 'id' }),
          db.collection('users').getList(1, 1, { fields: 'id' }),
        ]);

        const revenue = ordersRes.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
        const paid = ordersRes.filter(o => o.status === 'Paid').length;
        const pending = ordersRes.filter(o => o.status === 'Pending').length;

        setStats({
          totalOrders: ordersRes.length,
          outOfStock: productsRes.length,
          totalRevenue: revenue,
          totalUsers: usersRes.totalItems || 0,
          paidOrders: paid,
          pendingOrders: pending,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const promoConfig = (() => {
    try {
      const raw = localStorage.getItem('testone_promo_config');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { code: 'TESTONE20', discountPercent: 20, enabled: true, delayMs: 8000 };
  })();

  const cards = [
    { label: 'Catalog Products', value: catalog.total, sub: `${catalog.testOneCount} Test One · ${catalog.competitorCount} competitors`, icon: Package, color: 'gold' },
    { label: 'Categories', value: catalog.categoryCount, sub: 'Product categories live', icon: Layers, color: 'blue' },
    { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.paidOrders} paid · ${stats.pendingOrders} pending`, icon: ShoppingBag, color: 'emerald' },
    { label: 'Revenue', value: formatINR(stats.totalRevenue), sub: 'From all orders (INR)', icon: IndianRupee, color: 'purple' },
    { label: 'Low Stock', value: catalog.lowStockCount, sub: `${catalog.outOfStockCount} out of stock`, icon: AlertTriangle, color: 'rose' },
    { label: 'Users', value: stats.totalUsers, sub: 'Registered accounts', icon: Users, color: 'slate' },
  ];

  const colorMap: Record<string, string> = {
    gold: 'bg-primary-50 text-primary-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif text-gray-900">Dashboard Overview</h3>
        <p className="text-sm text-gray-500 mt-1">Test One Solutions India — live storefront operations</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[card.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping & Tax Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-primary-500" />
            <h4 className="font-bold text-gray-900 text-sm">Shipping & Delivery</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Free shipping threshold</span>
              <span className="font-bold">{formatINR(shipping.freeShippingThreshold)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">States/UTs configured</span>
              <span className="font-bold">{shipping.stateRates.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Free delivery zones</span>
              <span className="font-bold text-green-600">{shipping.stateRates.filter(r => r.charge === 0).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Avg delivery charge</span>
              <span className="font-bold">{formatINR(Math.round(shipping.stateRates.reduce((s, r) => s + r.charge, 0) / shipping.stateRates.length))}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="w-5 h-5 text-primary-500" />
            <h4 className="font-bold text-gray-900 text-sm">Tax & Promotions</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">GST rate</span>
              <span className="font-bold">{shipping.gstRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active promo code</span>
              <span className="font-mono font-bold text-primary-600">{promoConfig.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="font-bold text-green-600">{promoConfig.discountPercent}% off</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Popup status</span>
              <span className={`font-bold ${promoConfig.enabled ? 'text-green-600' : 'text-red-500'}`}>
                {promoConfig.enabled ? `Active (${promoConfig.delayMs / 1000}s delay)` : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
