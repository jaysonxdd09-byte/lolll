import React from 'react';
import {
  ShoppingCart,
  Heart,
  CreditCard,
  Search,
  FileText,
  Award,
  MessageCircle,
  Shield,
  Zap,
} from 'lucide-react';
import { getCatalogStats, productCategories } from '../../../lib/adminProducts';

const features = [
  { icon: ShoppingCart, title: 'Cart & Buy Now', desc: 'Sidebar cart, quantity controls, Razorpay checkout flow' },
  { icon: Heart, title: 'Wishlist', desc: 'Saved products persisted in localStorage' },
  { icon: Zap, title: 'Test One Alternatives', desc: 'Modal recommends Test One when competitor brands are added' },
  { icon: CreditCard, title: 'Checkout & Orders', desc: 'Shipping form, local orders, payment integration' },
  { icon: Search, title: 'Search & Filters', desc: 'Category filters across 16 product categories' },
  { icon: Award, title: 'Certificates', desc: 'Dedicated certificates page and section' },
  { icon: FileText, title: 'Blogs & FAQ', desc: 'Blog listing, details, and FAQ page' },
  { icon: MessageCircle, title: 'Distributor Inquiry', desc: 'Lead form for distributor partnerships' },
  { icon: Shield, title: 'Auth & Roles', desc: 'Customer, staff, and admin roles with protected admin panel' },
];

export default function FeaturesTab() {
  const catalog = getCatalogStats();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-gray-900">Storefront Features</h3>
        <p className="text-sm text-gray-500 mt-1">
          {catalog.total} products live · {catalog.testOneCount} Test One · {catalog.categoryCount} categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary-200 transition-colors">
            <f.icon className="w-6 h-6 text-primary-600 mb-3" />
            <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3">Product categories on storefront</h4>
        <div className="flex flex-wrap gap-2">
          {productCategories.map((c) => (
            <span key={c} className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

