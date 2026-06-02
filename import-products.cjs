// Direct product import script for local database
const fs = require('fs');

// Read the CSV file
const csvContent = fs.readFileSync('./public/Sheet4.csv', 'utf-8');

// Parse the CSV - improved version
function parseProductCSV(csvContent) {
  const lines = csvContent.split('\n');
  const products = [];
  let currentBrand = '';
  let lineNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    lineNumber++;
    
    // Check for brand headers - be more flexible with matching
    const upperLine = line.toUpperCase();
    
    if (upperLine.includes('3M INDIA') || upperLine.includes('\"3M INDIA\"')) {
      currentBrand = '3M';
      console.log(`Line ${lineNumber}: Found brand 3M`);
      continue;
    }
    if (upperLine.includes('SMITH & NEPHEW') || upperLine.includes('SMITH AND NEPHEW')) {
      currentBrand = 'Smith & Nephew';
      console.log(`Line ${lineNumber}: Found brand Smith & Nephew`);
      continue;
    }
    if (upperLine.includes('SURGIWEAR')) {
      currentBrand = 'Surgiwear';
      console.log(`Line ${lineNumber}: Found brand Surgiwear`);
      continue;
    }
    if (upperLine.includes('BSN ESSITY')) {
      currentBrand = 'BSN Essity';
      console.log(`Line ${lineNumber}: Found brand BSN Essity`);
      continue;
    }
    if (upperLine.includes('PARAMOUNT')) {
      currentBrand = 'Paramount';
      console.log(`Line ${lineNumber}: Found brand Paramount`);
      continue;
    }
    if (upperLine.includes('ESS KAE MEDICURE')) {
      currentBrand = 'Ess Kae Medicure';
      console.log(`Line ${lineNumber}: Found brand Ess Kae Medicure`);
      continue;
    }
    if (upperLine.includes('SANVIN CARE')) {
      currentBrand = 'Sanvin Care';
      console.log(`Line ${lineNumber}: Found brand Sanvin Care`);
      continue;
    }
    if (upperLine.includes('TEST ONE SOLUTION')) {
      currentBrand = 'Test One';
      console.log(`Line ${lineNumber}: Found brand Test One`);
      continue;
    }
    
    // Skip empty lines, headers, and section markers
    if (!line.trim() || line.includes('#') || line.includes('PRODUCT NAME') || line.includes('S.NO')) continue;
    
    // Parse product data - handle CSV format properly
    const cols = line.split(',');
    if (cols.length >= 4) {
      const sno = cols[1]?.trim() || '';
      const nameCol = cols[2]?.trim() || '';
      const name = nameCol.replace(/"/g, '').trim();
      const packingCol = cols[3]?.trim() || '';
      const packing = packingCol.replace(/"/g, '').trim();
      const mrp = parseFloat(cols[4]) || 0;
      const rate = parseFloat(cols[5]) || 0;
      
      // Skip rows without valid name or MRP
      if (!name || name === 'PRODUCT NAME' || !currentBrand) continue;
      
      // Skip rows with no MRP (header rows, empty rows)
      if (mrp === 0 && !sno.match(/^\d+$/)) continue;
      
      products.push({ sno, name, packing, mrp, rate, brand: currentBrand });
    }
  }
  
  return products;
}

function getCategory(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('gown')) return 'Surgical Gown';
  if (lowerName.includes('drape') || lowerName.includes('sheet')) return 'Surgical Drape';
  if (lowerName.includes('tape') || lowerName.includes('bandage') || lowerName.includes('micropore') || lowerName.includes('durapore') || lowerName.includes('transpore') || lowerName.includes('fixomull') || lowerName.includes('elastomull') || lowerName.includes('leucoband') || lowerName.includes('gypsona') || lowerName.includes('primapore')) return 'Surgical Tapes';
  if (lowerName.includes('blade')) return 'Surgical Instruments';
  if (lowerName.includes('diaper') || lowerName.includes('wipes') || lowerName.includes('underpad')) return 'Patient Care';
  if (lowerName.includes('stethoscope') || lowerName.includes('ecg')) return 'Diagnostic';
  if (lowerName.includes('handrub') || lowerName.includes('skin prep') || lowerName.includes('avagard') || lowerName.includes('prep') || lowerName.includes('ioban')) return 'Skin Preparation';
  if (lowerName.includes('opsite') || lowerName.includes('tegaderm') || lowerName.includes('iv3000') || lowerName.includes('bactigras') || lowerName.includes('jelonet') || lowerName.includes('cavilon')) return 'Wound Care';
  if (lowerName.includes('g dress') || lowerName.includes('g-patch') || lowerName.includes('g-bone')) return 'Neurosurgery';
  if (lowerName.includes('vp ') || lowerName.includes('drainage')) return 'Neurosurgery';
  if (lowerName.includes('cannula') || lowerName.includes('fixator')) return 'IV Supplies';
  if (lowerName.includes('marker')) return 'Surgical Markers';
  if (lowerName.includes('kit') || lowerName.includes('hiv')) return 'Surgical Kits';
  if (lowerName.includes('c-arm') || lowerName.includes('camera cover')) return 'Equipment Covers';
  return 'Medical Supplies';
}

function generateProductId(brand, index) {
  const brandPrefix = brand.substring(0, 3).toLowerCase().replace(/[^a-z]/g, '');
  return brandPrefix + String(index).padStart(6, '0');
}

function getProductImage(name, brand) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('drape')) return 'https://images.unsplash.com/photo-1584482968633-e39a2c2cd70b?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('gown')) return 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('tape') || lowerName.includes('bandage')) return 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('blade')) return 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('diaper') || lowerName.includes('wipes')) return 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('stethoscope')) return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('handrub') || lowerName.includes('prep')) return 'https://images.unsplash.com/photo-1588776814546-ec7e4d2c3a06?auto=format&fit=crop&q=80&w=400';
  if (lowerName.includes('dressing') || lowerName.includes('wound') || lowerName.includes('opsite') || lowerName.includes('tegaderm')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400';
  const brandImages = {
    '3M': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    'Smith & Nephew': 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=400',
    'Surgiwear': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
    'BSN Essity': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=400',
    'Paramount': 'https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=400',
    'Ess Kae Medicure': 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&q=80&w=400',
    'Sanvin Care': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    'Test One': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=400'
  };
  return brandImages[brand] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
}

// Execute import
const products = parseProductCSV(csvContent);
console.log('✅ Parsed', products.length, 'products from CSV');

// Show brand breakdown
const brandCounts = {};
products.forEach(p => {
  brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
});
console.log('\n📊 Brands found:');
Object.entries(brandCounts).forEach(([brand, count]) => {
  console.log(`  - ${brand}: ${count} products`);
});

// Generate output JSON for products
const outputProducts = products.map((product, i) => {
  const id = generateProductId(product.brand, i + 1);
  const price = product.rate > 0 ? product.rate : (product.mrp > 0 ? Math.round(product.mrp * 0.7) : 100);
  
  return {
    id: id,
    name: product.name,
    price: price,
    mrp: product.mrp,
    category: getCategory(product.name),
    brand: product.brand,
    description: `${product.name} - ${product.packing || 'Medical grade product'}`,
    rating: 4.5,
    stock_quantity: 100,
    image: getProductImage(product.name, product.brand),
    code: product.sno || id,
    gst: '5%'
  };
});

// Save to JSON file for import
fs.writeFileSync('./src/data/products-new.json', JSON.stringify(outputProducts, null, 2));
console.log('\n✅ Products saved to src/data/products-new.json');

// Also update the products.ts file directly
let tsContent = `export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  brand: string;
  reviews?: number;
  stock_quantity: number;
  code?: string;
  gst?: string;
  mrp?: number;
}

export const categories = [
  'All',
  'Surgical Drape',
  'Surgical Gown',
  'Surgical Tapes',
  'Wound Care',
  'Surgical Instruments',
  'Patient Care',
  'Diagnostic',
  'Skin Preparation',
  'Neurosurgery',
  'IV Supplies',
  'Surgical Kits',
  'Equipment Covers',
  'Surgical Markers',
  'Medical Supplies'
];

export const brands = [
  '3M',
  'Smith & Nephew',
  'Surgiwear',
  'BSN Essity',
  'Paramount',
  'Ess Kae Medicure',
  'Sanvin Care',
  'Test One'
];

export const products: Product[] = ${JSON.stringify(outputProducts, null, 2)};
`;

fs.writeFileSync('./src/data/products.ts', tsContent);
console.log('✅ Products.ts file updated with new products!');
console.log('\n🚀 Import complete!');
console.log(`📦 Total products: ${outputProducts.length}`);
