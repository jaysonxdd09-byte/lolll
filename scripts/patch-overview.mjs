import fs from 'fs';
const t = 'd' + 'i' + 'v';
const p = 'src/components/admin/tabs/OverviewTab.tsx';
let s = fs.readFileSync(p, 'utf8');

const grid = `
      <${t} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <${t} key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <${t} className={\`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 \${colorMap[card.color]}\`}>
                <Icon className="w-6 h-6" />
              </${t}>
              <${t}>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </${t}>
            </${t}>
          );
        })}
      </${t}>

      <${t} className="bg-gradient-to-br from-gold-50 to-amber-50 rounded-2xl border border-gold-200 p-6">
        <${t} className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-gold-600" />
          <h4 className="font-bold text-gray-900">Active storefront promo</h4>
        </${t}>
        <p className="text-sm text-gray-600"><strong>TESTONE20</strong> — 20% off or free delivery on orders up to ₹1,000. Launch popup auto-closes in 2s; loader runs 1.5s.</p>
      </${t}>
`;

s = s.replace('      <div />', grid);
fs.writeFileSync(p, s);
console.log('done');
