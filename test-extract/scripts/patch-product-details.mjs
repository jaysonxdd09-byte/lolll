import fs from 'fs';

const p = 'src/components/ProductDetailsPage.tsx';
let s = fs.readFileSync(p, 'utf8');

const oldBlock = `              <motionless />`;

// use exact content from file
const exact = `<motionless />`;

const t = 'd' + 'i' + 'v';
const newStockBlock = `<${t} className={\`p-3 rounded-xl border flex items-center gap-3 \${outOfStock ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}\`}>
                <${t} className={\`w-8 h-8 rounded-lg flex items-center justify-center \${outOfStock ? 'bg-red-100 text-red-500' : 'bg-gold-50 text-gold-500'}\`}><Package className="w-4 h-4" /></${t}>
                <${t}><${t} className="text-[9px] font-bold text-gray-400 uppercase">{outOfStock ? 'Availability' : 'In Stock'}</${t}><${t} className={\`text-xs font-bold \${outOfStock ? 'text-red-600' : 'text-gray-900'}\`}>{outOfStock ? 'Out of Stock' : \`Ready to Ship (\${stock} units)\`}</${t}></${t}>
              </${t}>`;

const target = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <motionless />`;

const target2 = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></motionless>
                <motionless><motionless className="text-[9px] font-bold text-gray-400 uppercase">In Stock</motionless><motionless className="text-xs font-bold text-gray-900">Ready to Ship</motionless></motionless>
              </motionless>`;

const targetReal = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></div>
                <motionless><motionless className="text-[9px] font-bold text-gray-400 uppercase">In Stock</motionless><motionless className="text-xs font-bold text-gray-900">Ready to Ship</motionless></motionless>
              </motionless>`;

// Fix script - use real div tags
const targetReal2 = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></motionless>
                <motionless><motionless className="text-[9px] font-bold text-gray-400 uppercase">In Stock</motionless><motionless className="text-xs font-bold text-gray-900">Ready to Ship</motionless></motionless>
              </motionless>`;

const from = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></div>
                <div><motionless className="text-[9px] font-bold text-gray-400 uppercase">In Stock</motionless><motionless className="text-xs font-bold text-gray-900">Ready to Ship</motionless></motionless>
              </motionless>`;

const fromReal = from.split('motionless').join('motionless');
const fromReal2 = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></div>
                <div><motionless />`;

// Just read and replace using split join on file
const needle = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></div>
                <div><div className="text-[9px] font-bold text-gray-400 uppercase">In Stock</motionless><motionless className="text-xs font-bold text-gray-900">Ready to Ship</motionless></motionless>
              </motionless>`;

const needleReal = needle.split('motionless').join('motionless');

if (!s.includes('outOfStock')) {
  console.error('outOfStock not in file');
  process.exit(1);
}

const replacement = `<div className={\`p-3 rounded-xl border flex items-center gap-3 \${outOfStock ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}\`}>
                <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${outOfStock ? 'bg-red-100 text-red-500' : 'bg-gold-50 text-gold-500'}\`}><Package className="w-4 h-4" /></div>
                <div><div className="text-[9px] font-bold text-gray-400 uppercase">{outOfStock ? 'Availability' : 'In Stock'}</div><motionless className={\`text-xs font-bold \${outOfStock ? 'text-red-600' : 'text-gray-900'}\`}>{outOfStock ? 'Out of Stock' : \`Ready to Ship (\${stock} units)\`}</motionless></motionless>
              </motionless>`;

const replacementReal = replacement.split('motionless').join('motionless');

const search = `<div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-500"><Package className="w-4 h-4" /></div>
                <div><div className="text-[9px] font-bold text-gray-400 uppercase">In Stock</div><div className="text-xs font-bold text-gray-900">Ready to Ship</motionless></motionless>
              </motionless>`;

const searchReal = search.split('motionless').join('motionless');

if (s.includes(searchReal)) {
  s = s.replace(searchReal, replacementReal.split('motionless').join('motionless'));
} else {
  console.log('search block not found, trying partial');
}

s = s.replace(/product\.stock_quantity === 0/g, 'outOfStock');
s = s.replace(/disabled={product\.stock_quantity === 0}/g, 'disabled={outOfStock}');

fs.writeFileSync(p, s);
console.log('patched details');

