import fs from 'fs';
const t = 'd' + 'i' + 'v';

const promoTab = `import React from 'react';
import { Sparkles, Timer, Percent, Truck, RotateCcw } from 'lucide-react';

export default function PromoTab() {
  const resetPromoSession = () => {
    sessionStorage.removeItem('test_one_promo_seen');
    alert('Promo session cleared. Refresh the storefront to see the launch popup again.');
  };

  return (
    <${t} className="space-y-8">
      <${t}>
        <h3 className="text-2xl font-serif text-gray-900">Promotions & Launch</h3>
        <p className="text-sm text-gray-500 mt-1">Matches the live storefront inaugural offer (TESTONE20)</p>
      </${t}>

      <${t} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <${t} className="bg-gradient-to-br from-gold-600 to-amber-500 rounded-2xl p-6 text-white">
          <Sparkles className="w-8 h-8 mb-4 opacity-90" />
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Active code</p>
          <p className="text-3xl font-mono font-black mt-1">TESTONE20</p>
          <p className="text-sm mt-3 opacity-90">20% off first order OR free delivery on orders up to ₹1,000</p>
        </${t}>

        <${t} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <${t} className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-gold-600" />
            <${t}>
              <p className="font-bold text-gray-900">Startup loader</p>
              <p className="text-xs text-gray-500">1.5 seconds fixed duration</p>
            </${t}>
          </${t}>
          <${t} className="flex items-center gap-3">
            <Percent className="w-5 h-5 text-gold-600" />
            <${t}>
              <p className="font-bold text-gray-900">Launch popup</p>
              <p className="text-xs text-gray-500">Opens after loader; auto-closes in 2 seconds</p>
            </${t}>
          </${t}>
          <${t} className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-gold-600" />
            <${t}>
              <p className="font-bold text-gray-900">Smart alternatives</p>
              <p className="text-xs text-gray-500">Suggests Test One when competitor items are added to cart</p>
            </${t}>
          </${t}>
        </${t}>
      </${t}>

      <button
        onClick={resetPromoSession}
        className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gold-600 transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Reset promo popup for testing
      </button>
    </${t}>
  );
}
`;

const featuresTab = `import React from 'react';
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
  { icon: CreditCard, title: 'Checkout & Orders', desc: 'Shipping form, PocketBase orders, payment integration' },
  { icon: Search, title: 'Search & Filters', desc: 'Category filters across 16 product categories' },
  { icon: Award, title: 'Certificates', desc: 'Dedicated certificates page and section' },
  { icon: FileText, title: 'Blogs & FAQ', desc: 'Blog listing, details, and FAQ page' },
  { icon: MessageCircle, title: 'Distributor Inquiry', desc: 'Lead form for distributor partnerships' },
  { icon: Shield, title: 'Auth & Roles', desc: 'Customer, staff, and admin roles with protected admin panel' },
];

export default function FeaturesTab() {
  const catalog = getCatalogStats();

  return (
    <${t} className="space-y-8">
      <${t}>
        <h3 className="text-2xl font-serif text-gray-900">Storefront Features</h3>
        <p className="text-sm text-gray-500 mt-1">
          {catalog.total} products live · {catalog.testOneCount} Test One · {catalog.categoryCount} categories
        </p>
      </${t}>

      <${t} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <${t} key={f.title} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gold-200 transition-colors">
            <f.icon className="w-6 h-6 text-gold-600 mb-3" />
            <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
          </${t}>
        ))}
      </${t}>

      <${t} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3">Product categories on storefront</h4>
        <${t} className="flex flex-wrap gap-2">
          {productCategories.map((c) => (
            <span key={c} className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600">
              {c}
            </span>
          ))}
        </${t}>
      </${t}>
    </${t}>
  );
}
`;

fs.writeFileSync('src/components/admin/tabs/PromoTab.tsx', promoTab);
fs.writeFileSync('src/components/admin/tabs/FeaturesTab.tsx', featuresTab);
console.log('wrote promo + features tabs');

