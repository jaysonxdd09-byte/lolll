import { Product, products as catalogProducts, categories } from '../data/products';
import { loadCollection, upsertRecord, deleteRecord } from './contentStore';
import { pb } from './pbClient';

export type ProductSource = 'catalog' | 'database' | 'synced';

export type AdminProduct = Product & {
  _source: ProductSource;
};

export const productCategories = categories.filter((c) => c !== 'All');

/** Storefront + admin: get the live products directly from localStorage */
export function mergeStorefrontProducts(dbProducts: Product[]): Product[] {
  // dbProducts is already the live data from pb_col_products (localStorage)
  // Just normalize numeric fields
  return dbProducts.map(p => ({
    ...p,
    price: Number(p.price ?? 0),
    stock_quantity: Number(p.stock_quantity ?? 0),
    rating: Number(p.rating ?? 4.5),
  }));
}

export function mergeCatalogWithDatabase(dbProducts: Product[]): AdminProduct[] {
  const usedDbIds = new Set<string>();

  const merged: AdminProduct[] = catalogProducts.map((catalogItem) => {
    const dbMatch =
      dbProducts.find((p) => p.id === catalogItem.id) ||
      dbProducts.find(
        (p) => p.name?.trim().toLowerCase() === catalogItem.name.trim().toLowerCase()
      );

    if (dbMatch?.id) usedDbIds.add(dbMatch.id);

    const product = {
      ...catalogItem,
      ...dbMatch,
      id: catalogItem.id,
      price: Number((dbMatch || catalogItem).price ?? 0),
      stock_quantity: Number((dbMatch || catalogItem).stock_quantity ?? 0),
      rating: Number((dbMatch || catalogItem).rating ?? 4.5),
    };

    return {
      ...product,
      _source: dbMatch ? 'synced' : 'catalog',
    } as AdminProduct;
  });

  dbProducts.forEach((dbItem) => {
    if (usedDbIds.has(dbItem.id)) return;
    const inCatalog = catalogProducts.some(
      (p) => p.name.trim().toLowerCase() === dbItem.name?.trim().toLowerCase()
    );
    if (!inCatalog) {
      merged.push({ ...dbItem, _source: 'database' });
    }
  });

  return merged;
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const dbProducts = await loadCollection<Product>('products', {
    column: 'created_at',
    ascending: false,
  });
  return mergeCatalogWithDatabase(dbProducts);
}

export function productToPayload(product: Partial<Product>): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    brand: product.brand,
    image: product.image,
    description: product.description,
    rating: product.rating ?? 4.5,
    stock_quantity: product.stock_quantity ?? 0,
  };

  if (product.code) payload.code = product.code;
  if (product.gst) payload.gst = product.gst;
  if (product.mrp != null) payload.mrp = product.mrp;
  if (product.mrp_box != null) payload.mrp_box = product.mrp_box;
  if (product.mrp_piece != null) payload.mrp_piece = product.mrp_piece;
  if (product.rate_box != null) payload.rate_box = product.rate_box;
  if (product.rate_piece != null) payload.rate_piece = product.rate_piece;

  return payload;
}

export async function saveAdminProduct(product: Partial<Product>): Promise<void> {
  const payload = productToPayload(product) as unknown as Product;
  if (!payload.id || !payload.name) {
    throw new Error('Product id and name are required');
  }

  // Save directly to pb_col_products via pbClient (which writes to localStorage)
  await upsertRecord('products', payload);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('catalog-updated'));
  }
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await deleteRecord('products', id);
}

export async function syncCatalogToDatabase(): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  for (const product of catalogProducts) {
    try {
      await upsertRecord('products', productToPayload(product) as unknown as Product);
      synced += 1;
    } catch {
      failed += 1;
    }
  }

  return { synced, failed };
}

export function getCatalogStats() {
  // Read live data from localStorage instead of hardcoded catalog
  const liveKey = 'pb_col_products';
  let liveProducts: Product[] = [];
  try {
    const raw = localStorage.getItem(liveKey);
    liveProducts = raw ? JSON.parse(raw) : catalogProducts;
  } catch {
    liveProducts = catalogProducts;
  }

  const testOne = liveProducts.filter((p) => p.brand === 'Test One');
  const competitor = liveProducts.filter((p) => p.brand !== 'Test One');
  const lowStock = liveProducts.filter((p) => Number(p.stock_quantity) <= 10);
  const outOfStock = liveProducts.filter((p) => Number(p.stock_quantity) === 0);

  return {
    total: liveProducts.length,
    testOneCount: testOne.length,
    competitorCount: competitor.length,
    categoryCount: productCategories.length,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
  };
}

