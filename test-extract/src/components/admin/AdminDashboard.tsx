import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Image as ImageIcon, Users, FileText, BarChart3, Sparkles, Layers, Truck, Building2, Upload, Video, Search, ArrowLeft } from 'lucide-react';
import BackButton from '../BackButton';

import OverviewTab from './tabs/OverviewTab';
import ProductsTab from './tabs/ProductsTab';
import BrandsTab from './tabs/BrandsTab';
import OrdersTab from './tabs/OrdersTab';
import HeroTab from './tabs/HeroTab';
import UsersTab from './tabs/UsersTab';
import BlogsTab from './tabs/BlogsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PromoTab from './tabs/PromoTab';
import FeaturesTab from './tabs/FeaturesTab';
import ImportProductsTab from './tabs/ImportProductsTab';
import ShippingTab from './tabs/ShippingTab';
import DoctorTestimonialsTab from './tabs/DoctorTestimonialsTab';
import SEOManagerTab from './tabs/SEOManagerTab';

interface AdminDashboardProps {
  user: any;
  userRole: 'customer' | 'staff' | 'admin';
  onBack?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, userRole, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'brands' | 'orders' | 'hero' | 'users' | 'blogs' | 'analytics' | 'promo' | 'features' | 'import' | 'shipping' | 'testimonials' | 'seo'>('overview');

  if (userRole === 'customer' && !['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase() || '')) {
    return <div className="min-h-screen flex items-center justify-center pt-24"><p>Access Denied.</p></div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, roles: ['admin'] },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'features', label: 'Features', icon: <Layers className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" />, roles: ['admin'] },
    { id: 'brands', label: 'Brands', icon: <Building2 className="w-5 h-5" />, roles: ['admin'] },
    { id: 'import', label: 'Import CSV', icon: <Upload className="w-5 h-5" />, roles: ['admin'] },
    { id: 'promo', label: 'Promo', icon: <Sparkles className="w-5 h-5" />, roles: ['admin'] },
    { id: 'hero', label: 'Hero Slides', icon: <ImageIcon className="w-5 h-5" />, roles: ['admin'] },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-5 h-5" />, roles: ['admin', 'staff'] },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, roles: ['admin'] },
    { id: 'shipping', label: 'Shipping', icon: <Truck className="w-5 h-5" />, roles: ['admin'] },
    { id: 'testimonials', label: 'Doctor Videos', icon: <Video className="w-5 h-5" />, roles: ['admin'] },
    { id: 'seo', label: 'SEO Manager', icon: <Search className="w-5 h-5" />, roles: ['admin'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex pt-24">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-[calc(100vh-6rem)]">
        <div className="p-6 border-b border-gray-100">
          {onBack && (
            <BackButton onBack={onBack} label="Back to Store" className="mb-4" />
          )}
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
                  ? 'bg-primary-50 text-primary-600' 
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
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'orders' && <OrdersTab userRole={userRole} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'brands' && <BrandsTab />}
          {activeTab === 'import' && <ImportProductsTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'blogs' && <BlogsTab />}
          {activeTab === 'promo' && <PromoTab />}
          {activeTab === 'features' && <FeaturesTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'shipping' && <ShippingTab />}
          {activeTab === 'testimonials' && <DoctorTestimonialsTab />}
          {activeTab === 'seo' && <SEOManagerTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

