import fs from 'fs';

const p = 'src/components/admin/AdminDashboard.tsx';
let s = fs.readFileSync(p, 'utf8');

if (!s.includes('PromoTab')) {
  s = s.replace(
    "import { LayoutDashboard, Package, ShoppingBag, Image as ImageIcon, Users, FileText, BarChart3 } from 'lucide-react';",
    "import { LayoutDashboard, Package, ShoppingBag, Image as ImageIcon, Users, FileText, BarChart3, Sparkles, Layers } from 'lucide-react';"
  );
  s = s.replace(
    "import AnalyticsTab from './tabs/AnalyticsTab';",
    "import AnalyticsTab from './tabs/AnalyticsTab';\nimport PromoTab from './tabs/PromoTab';\nimport FeaturesTab from './tabs/FeaturesTab';"
  );
  s = s.replace(
    "'overview' | 'products' | 'orders' | 'hero' | 'users' | 'blogs' | 'analytics'",
    "'overview' | 'products' | 'orders' | 'hero' | 'users' | 'blogs' | 'analytics' | 'promo' | 'features'"
  );
  s = s.replace(
    "{ id: 'products', label: 'Products', icon: <Package className=\"w-5 h-5\" />, roles: ['admin'] },",
    "{ id: 'features', label: 'Features', icon: <Layers className=\"w-5 h-5\" />, roles: ['admin', 'staff'] },\n    { id: 'products', label: 'Products', icon: <Package className=\"w-5 h-5\" />, roles: ['admin'] },\n    { id: 'promo', label: 'Promo', icon: <Sparkles className=\"w-5 h-5\" />, roles: ['admin'] },"
  );
  s = s.replace(
    "{activeTab === 'users' && <UsersTab />}",
    "{activeTab === 'promo' && <PromoTab />}\n          {activeTab === 'features' && <FeaturesTab />}\n          {activeTab === 'users' && <UsersTab />}"
  );
  s = s.replace(
    "user?.email?.toLowerCase() !== 'aither200929@gmail.com'",
    "!['aither200929@gmail.com', 'maahi911111@gmail.com'].includes(user?.email?.toLowerCase() || '')"
  );
}

fs.writeFileSync(p, s);
console.log('patched dashboard');
