import fs from 'fs';

const t = 'd' + 'i' + 'v';
const path = 'src/components/admin/tabs/ProductsTab.tsx';
let src = fs.readFileSync(path, 'utf8');

const body = `
    <${t}>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
      />

      <${t} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <${t}>
          <h3 className="text-2xl font-serif text-gray-900">Product Catalog</h3>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} products · {stats.testOne} Test One · {stats.synced} synced to database
          </p>
        </${t}>
        <${t} className="flex flex-wrap gap-2">
          <button onClick={loadProducts} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleSync} disabled={syncing} className="px-4 py-2 rounded-lg border border-gold-200 bg-gold-50 text-gold-700 text-sm font-bold flex items-center gap-2 disabled:opacity-50">
            <Database className="w-4 h-4" /> {syncing ? 'Syncing...' : 'Sync Catalog to DB'}
          </button>
          <button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </${t}>
      </${t}>

      <${t} className="flex flex-wrap gap-3 mb-4">
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
      </${t}>

      <${t} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
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
                  <${t} className="flex items-center gap-3">
                    <${t} className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border">
                      {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 m-3 text-gray-400" />}
                    </${t}>
                    <${t}>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{product.brand}</p>
                    </${t}>
                  </${t}>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{product.code || '—'}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-900">{formatINR(product.price)}</p>
                  {product.mrp != null && <p className="text-xs text-gray-400 line-through">{formatINR(product.mrp)}</p>}
                </td>
                <td className="px-4 py-3"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{product.category}</span></td>
                <td className="px-4 py-3 font-medium">{product.stock_quantity}</td>
                <td className="px-4 py-3">{sourceBadge(product._source)}</td>
                <td className="px-4 py-3 text-right">
                  <${t} className="flex justify-end gap-1">
                    <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </${t}>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </${t}>
    </${t}>
`;

src = src.replace('  return (\n    <div />\n  );', `  return (${body}\n  );`);
fs.writeFileSync(path, src);
console.log('patched products tab');
