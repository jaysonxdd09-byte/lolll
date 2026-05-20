import fs from 'fs';

const p = 'src/components/ProductDetailsPage.tsx';
let s = fs.readFileSync(p, 'utf8');
const lines = s.split(/\r?\n/);
const from = lines.slice(101, 105).join('\n');
const t = 'd' + 'i' + 'v';

const to = `              <${t} className={\`p-3 rounded-xl border flex items-center gap-3 \${outOfStock ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}\`}>
                <${t} className={\`w-8 h-8 rounded-lg flex items-center justify-center \${outOfStock ? 'bg-red-100 text-red-500' : 'bg-gold-50 text-gold-500'}\`}><Package className="w-4 h-4" /></${t}>
                <${t}><${t} className="text-[9px] font-bold text-gray-400 uppercase">{outOfStock ? 'Availability' : 'In Stock'}</${t}><${t} className={\`text-xs font-bold \${outOfStock ? 'text-red-600' : 'text-gray-900'}\`}>{outOfStock ? 'Out of Stock' : \`Ready to Ship (\${stock} units)\`}</${t}></${t}>
              </${t}>`;

if (!s.includes(from)) {
  console.error('block not found');
  process.exit(1);
}

s = s.replace(from, to);
s = s.replace(/product\.stock_quantity === 0/g, 'outOfStock');
fs.writeFileSync(p, s);
console.log('patched');
