import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Image as ImageIcon, Users, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

import OverviewTab from './tabs/OverviewTab';
import ProductsTab from './tabs/ProductsTab';
import OrdersTab from './tabs/OrdersTab';
import HeroTab from './tabs/HeroTab';
import UsersTab from './tabs/UsersTab';
import BlogsTab from './tabs/BlogsTab';

interface AdminDashboardProps {
  user: any;
  userRole: 'customer' | 'staff' | 'admin';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, userRole }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'hero' | 'users' | 'blogs'>('overview');

  if (userRole === 'customer' && user?.email?.toLowerCase() !== 'aither200929@gmail.com') {
    return <div className="min-h-screen flex items-center justify-center pt-24"><p>Access Denied.</p></div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" />, roles: ['admin'] },
    { id: 'hero', label: 'Hero Slides', icon: <ImageIcon className="w-5 h-5" />, roles: ['admin'] },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, roles: ['admin'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex pt-24">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-[calc(100vh-6rem)]">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif text-gray-900">{userRole === 'admin' ? 'Admin Panel' : 'Staff Portal'}</h2>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.filter(t => t.roles.includes(userRole)).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold-50 text-gold-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm min-h-[500px] p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'orders' && <OrdersTab userRole={userRole} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'blogs' && <BlogsTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
