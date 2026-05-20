import { Product } from '../data/products';

const OVERRIDES_KEY = 'testone:product_overrides';

export type ProductOverrideMap = Record<string, Partial<Product>>;

export function getProductOverrides(): ProductOverrideMap {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setProductOverride(catalogId: string, patch: Partial<Product>): void {
  if (!catalogId) return;
  const all = getProductOverrides();
  all[catalogId] = {
    ...all[catalogId],
    ...patch,
    id: catalogId,
    stock_quantity:
      patch.stock_quantity !== undefined
        ? Number(patch.stock_quantity)
        : all[catalogId]?.stock_quantity,
  };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
}

export function normalizeProductFields<T extends Partial<Product>>(product: T): T & Product {
  return {
    ...product,
    price: Number(product.price ?? 0),
    stock_quantity: Number(product.stock_quantity ?? 0),
    rating: Number(product.rating ?? 4.5),
  } as T & Product;
}

export function applyProductOverrides(products: Product[]): Product[] {
  const overrides = getProductOverrides();
  return products.map((product) => {
    const override = overrides[product.id];
    if (!override) return normalizeProductFields(product);
    return normalizeProductFields({
      ...product,
      ...override,
      id: product.id,
    });
  });
}
