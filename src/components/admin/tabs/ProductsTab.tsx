import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, RefreshCw, Database } from 'lucide-react';
import ProductModal from '../modals/ProductModal';
import { formatINR } from '../../../lib/formatCurrency';
import {
  AdminProduct,
  fetchAdminProducts,
  saveAdminProduct,
  deleteAdminProduct,
  syncCatalogToDatabase,
  productCategories,
} from '../../../lib/adminProducts';

type BrandFilter = 'all' | 'Test One' | 'competitor';

export default function ProductsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [brandFilter, setBrandFilter] = useState<BrandFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      setProducts(await fetchAdminProducts());
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (brandFilter === 'Test One' && p.brand !== 'Test One') return false;
      if (brandFilter === 'competitor' && p.brand === 'Test One') return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.code?.toLowerCase().includes(q) ?? false) ||
          p.brand.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, brandFilter, categoryFilter, search]);

  const stats = useMemo(() => {
    const testOne = products.filter((p) => p.brand === 'Test One');
    return { total: products.length, testOne: testOne.length, synced: products.filter((p) => p._source === 'synced').length };
  }, [products]);

  const handleSave = async (productData: Partial<AdminProduct>) => {
    try {
      await saveAdminProduct(productData);
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Failed to save product: ' + msg);
      throw err;
    }
  };

  const handleUpdateStock = async (product: AdminProduct, rawValue: string) => {
    const newStock = parseInt(rawValue, 10);
    if (Number.isNaN(newStock) || newStock < 0) {
      alert('Enter a valid stock quantity (0 or more).');
      return;
    }
    if (newStock === product.stock_quantity) return;

    try {
      const { _source, ...rest } = product;
      await saveAdminProduct({ ...rest, stock_quantity: newStock });
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Failed to update stock: ' + msg);
      await loadProducts();
    }
  };

  const handleSync = async () => {
    if (!confirm('Sync all 38 catalog products to the database? Existing matches will be updated.')) return;
    setSyncing(true);
    try {
      const { synced, failed } = await syncCatalogToDatabase();
      await loadProducts();
      alert(`Sync complete: ${synced} saved${failed ? `, ${failed} failed` : ''}.`);
    } catch (err) {
      console.error(err);
      alert('Sync failed. Check console for details.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (product: AdminProduct) => {
    if (product._source === 'catalog') {
      alert('Built-in catalog products cannot be deleted. Sync overrides to the database instead.');
      return;
    }
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteAdminProduct(product.id);
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Failed to delete: ' + msg);
    }
  };

  const sourceBadge = (source: AdminProduct['_source']) => {
    const styles = {
      catalog: 'bg-blue-50 text-blue-600',
      synced: 'bg-emerald-50 text-emerald-600',
      database: 'bg-purple-50 text-purple-600',
    };
    const labels = { catalog: 'Catalog', synced: 'Synced', database: 'DB Only' };
    return (
      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${styles[source]}`}>
        {labels[source]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-serif text-gray-900">Product Catalog</h3>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} products · {stats.testOne} Test One · {stats.synced} synced to database
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={loadProducts} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleSync} disabled={syncing} className="px-4 py-2 rounded-lg border border-gold-200 bg-gold-50 text-gold-700 text-sm font-bold flex items-center gap-2 disabled:opacity-50">
            <Database className="w-4 h-4" /> {syncing ? 'Syncing...' : 'Sync Catalog to DB'}
          </button>
          <button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, code, brand..." className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value as BrandFilter)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All brands</option>
          <option value="Test One">Test One only</option>
          <option value="competitor">Competitor brands</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All categories</option>
          {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-bold uppercase text-[10px]">Product</th>
              <th className="px-4 py-3 font-bold uppercase text-[10px]">Code</th>
              <th className="px-4 py-3 font-bold uppercase text-[10px]">Rate / MRP</th>
              <th className="px-4 py-3 font-bold uppercase text-[10px]">Category</th>
              <th className="px-4 py-3 font-bold uppercase text-[10px]">Stock</th>
              <th className="px-4 py-3 font-bold uppercase text-[10px]">Source</th>
              <th className="px-4 py-3 font-bold uppercase text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400">No products match your filters.</td></tr>
            ) : filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border">
                      {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 m-3 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{product.code || '—'}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-900">{formatINR(product.price)}</p>
                  {product.mrp != null && <p className="text-xs text-gray-400 line-through">{formatINR(product.mrp)}</p>}
                </td>
                <td className="px-4 py-3"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{product.category}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      key={`${product.id}-${product.stock_quantity}`}
                      defaultValue={product.stock_quantity}
                      onBlur={(e) => handleUpdateStock(product, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      }}
                      className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                    {product.stock_quantity === 0 && (
                      <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded">Out</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{sourceBadge(product._source)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}
