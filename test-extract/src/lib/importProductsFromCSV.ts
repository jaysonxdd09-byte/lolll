import { db } from './dbClient';

interface CSVProduct {
  sno: string;
  name: string;
  packing: string;
  mrp: number;
  rate: number;
  brand: string;
}

// Parse the CSV content and extract products
export function parseProductCSV(csvContent: string): CSVProduct[] {
  const lines = csvContent.split('\n');
  const products: CSVProduct[] = [];
  let currentBrand = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if this is a brand header line
    if (line.includes('#') || line.includes('3M INDIA') || line.includes('SMITH & NEPHEW') || 
        line.includes('SURGIWEAR') || line.includes('BSN ESSITY') || line.includes('Paramount') ||
        line.includes('ESS KAE MEDICURE') || line.includes('Sanvin care') || 
        line.includes('TEST ONE SOLUTION')) {
      // Extract brand name
      const brandMatch = line.match(/#?\s*([\w\s&\.]+)\s*#/);
      if (brandMatch) {
        currentBrand = brandMatch[1].trim();
      } else if (line.includes('3M INDIA')) {
        currentBrand = '3M';
      } else if (line.includes('SMITH & NEPHEW')) {
        currentBrand = 'Smith & Nephew';
      } else if (line.includes('SURGIWEAR')) {
        currentBrand = 'Surgiwear';
      } else if (line.includes('BSN ESSITY')) {
        currentBrand = 'BSN Essity';
      } else if (line.includes('Paramount')) {
        currentBrand = 'Paramount';
      } else if (line.includes('ESS KAE MEDICURE')) {
        currentBrand = 'Ess Kae Medicure';
      } else if (line.includes('Sanvin care')) {
        currentBrand = 'Sanvin Care';
      } else if (line.includes('TEST ONE SOLUTION')) {
        currentBrand = 'Test One';
      }
      continue;
    }
    
    // Skip header lines
    if (line.includes('PRODUCT NAME') || line.includes('S.NO')) continue;
    
    // Parse product data
    const cols = line.split(',');
    if (cols.length >= 3) {
      const sno = cols[1]?.trim() || '';
      const name = cols[2]?.trim().replace(/"/g, '') || '';
      const packing = cols[3]?.trim().replace(/"/g, '') || '';
      const mrp = parseFloat(cols[4]) || 0;
      const rate = parseFloat(cols[5]) || 0;
      
      if (name && name !== 'PRODUCT NAME' && currentBrand) {
        products.push({
          sno,
          name,
          packing,
          mrp,
          rate,
          brand: currentBrand
        });
      }
    }
  }
  
  return products;
}

// Determine category based on product name
function getCategory(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('gown') || lowerName.includes('d800') || lowerName.includes('mae85')) {
    return 'Surgical Gown';
  }
  if (lowerName.includes('drape') || lowerName.includes('sheet')) {
    return 'Surgical Drape';
  }
  if (lowerName.includes('tape') || lowerName.includes('micropore') || lowerName.includes('durapore') || 
      lowerName.includes('transpore') || lowerName.includes('fixomull') || lowerName.includes('elastomull') ||
      lowerName.includes('leucoband') || lowerName.includes('gypsona') || lowerName.includes('primapore')) {
    return 'Surgical Tapes';
  }
  if (lowerName.includes('blade') || lowerName.includes('clipper')) {
    return 'Surgical Instruments';
  }
  if (lowerName.includes('diaper') || lowerName.includes('wipes') || lowerName.includes('underpad')) {
    return 'Patient Care';
  }
  if (lowerName.includes('stethoscope') || lowerName.includes('ecg')) {
    return 'Diagnostic';
  }
  if (lowerName.includes('handrub') || lowerName.includes('skin prep') || lowerName.includes('avagard') ||
      lowerName.includes('prep') || lowerName.includes('ioban')) {
    return 'Skin Preparation';
  }
  if (lowerName.includes('opsite') || lowerName.includes('tegaderm') || lowerName.includes('iv3000') ||
      lowerName.includes('bactigras') || lowerName.includes('jelonet') || lowerName.includes('cavilon')) {
    return 'Wound Care';
  }
  if (lowerName.includes('g dress') || lowerName.includes('g-patch') || lowerName.includes('g-bone')) {
    return 'Neurosurgery';
  }
  if (lowerName.includes('vp ') || lowerName.includes('drainage') || lowerName.includes('sh034') || 
      lowerName.includes('sh025') || lowerName.includes('sh024')) {
    return 'Neurosurgery';
  }
  if (lowerName.includes('cannula') || lowerName.includes('fixator')) {
    return 'IV Supplies';
  }
  if (lowerName.includes('marker')) {
    return 'Surgical Markers';
  }
  if (lowerName.includes('kit') || lowerName.includes('hiv')) {
    return 'Surgical Kits';
  }
  if (lowerName.includes('c-arm') || lowerName.includes('camera cover')) {
    return 'Equipment Covers';
  }
  
  return 'Medical Supplies';
}

// Generate a unique ID for the product
function generateProductId(brand: string, index: number): string {
  const brandPrefix = brand.substring(0, 3).toLowerCase().replace(/[^a-z]/g, '');
  return `${brandPrefix}${String(index).padStart(6, '0')}`;
}

// Import products to database
export async function importProductsToDatabase(products: CSVProduct[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    try {
      const id = generateProductId(product.brand, i + 1);
      const price = product.rate > 0 ? product.rate : (product.mrp > 0 ? product.mrp * 0.7 : 100);
      
      await db.collection('products').create({
        id: id,
        name: product.name,
        price: price,
        mrp: product.mrp > 0 ? product.mrp : price * 1.3,
        category: getCategory(product.name),
        brand: product.brand,
        description: `${product.name} - ${product.packing || 'Medical grade product'}`,
        rating: 4.5,
        stock_quantity: 100,
        image: getProductImage(product.name, product.brand),
        code: product.sno || id,
        gst: '5%'
      });
      
      success++;
    } catch (error) {
      console.error(`Failed to import product: ${product.name}`, error);
      failed++;
    }
  }
  
  return { success, failed };
}

// Get appropriate image URL based on product type
function getProductImage(name: string, brand: string): string {
  const lowerName = name.toLowerCase();
  
  // Map to relevant Unsplash images based on product type
  if (lowerName.includes('drape')) {
    return 'https://images.unsplash.com/photo-1584482968633-e39a2c2cd70b?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('gown')) {
    return 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('tape') || lowerName.includes('bandage')) {
    return 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('blade')) {
    return 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('diaper') || lowerName.includes('wipes')) {
    return 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('stethoscope')) {
    return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('handrub') || lowerName.includes('prep') || lowerName.includes('sanitizer')) {
    return 'https://images.unsplash.com/photo-1588776814546-ec7e4d2c3a06?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('dressing') || lowerName.includes('wound') || lowerName.includes('opsite') || lowerName.includes('tegaderm')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400';
  }
  
  // Default images based on brand
  const brandImages: Record<string, string> = {
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

// Delete all existing products from database
export async function deleteAllProducts(): Promise<{ deleted: number; failed: number }> {
  let deleted = 0;
  let failed = 0;
  
  try {
    const allProducts = await db.collection('products').getFullList();
    
    for (const product of allProducts) {
      try {
        await db.collection('products').delete(product.id);
        deleted++;
      } catch (error) {
        console.error(`Failed to delete product: ${product.id}`, error);
        failed++;
      }
    }
  } catch (error) {
    console.error('Failed to fetch products for deletion:', error);
  }
  
  return { deleted, failed };
}
