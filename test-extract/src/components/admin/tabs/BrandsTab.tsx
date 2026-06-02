import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, RefreshCw, Building2, Package, AlertTriangle, X, Upload } from 'lucide-react';
import ProductModal from '../modals/ProductModal';
import { formatINR } from '../../../lib/formatCurrency';
import {
  AdminProduct,
  fetchAdminProducts,
  saveAdminProduct,
  deleteAdminProduct,
  syncCatalogToDatabase,
} from '../../../lib/adminProducts';

type BrandData = {
  name: string;
  productCount: number;
  products: AdminProduct[];
};

type BrandInfo = {
  name: string;
  image: string;
  description?: string;
};

export default function BrandsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<AdminProduct>>>({});
  const [syncing, setSyncing] = useState(false);
  
  // Brand management state
  const [brandsInfo, setBrandsInfo] = useState<Record<string, BrandInfo>>({});
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandInfo | null>(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandImage, setNewBrandImage] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    loadBrandsInfo();
  }, []);

  // Load brands info from localStorage
  const loadBrandsInfo = () => {
    try {
      const stored = localStorage.getItem('test_one_brands_info');
      if (stored) {
        setBrandsInfo(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading brands info:', e);
    }
  };

  // Save brands info to localStorage
  const saveBrandsInfo = (info: Record<string, BrandInfo>) => {
    try {
      localStorage.setItem('test_one_brands_info', JSON.stringify(info));
      setBrandsInfo(info);
    } catch (e) {
      console.error('Error saving brands info:', e);
    }
  };

  // Sync catalog products to database
  const handleSyncCatalog = async () => {
    if (!confirm('Sync all catalog products to the database?\n\nThis will ensure all brands and products are properly registered in the system.')) {
      return;
    }
    setSyncing(true);
    try {
      const result = await syncCatalogToDatabase();
      alert(`Sync complete!\n${result.synced} products synced\n${result.failed} failed`);
      await loadProducts();
    } catch (err) {
      console.error('Sync error:', err);
      alert('Failed to sync catalog');
    } finally {
      setSyncing(false);
    }
  };

  const handleAddBrand = () => {
    if (!newBrandName.trim()) {
      alert('Please enter a brand name');
      return;
    }
    
    const brandName = newBrandName.trim();
    const updatedInfo = {
      ...brandsInfo,
      [brandName]: {
        name: brandName,
        image: newBrandImage.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
        description: newBrandDescription.trim()
      }
    };
    
    saveBrandsInfo(updatedInfo);
    setIsBrandModalOpen(false);
    setNewBrandName('');
    setNewBrandImage('');
    setNewBrandDescription('');
    alert(`Brand "${brandName}" added successfully!`);
  };

  const handleEditBrand = (brandName: string) => {
    const info = brandsInfo[brandName] || { name: brandName, image: '', description: '' };
    setEditingBrand(info);
    setNewBrandName(info.name);
    setNewBrandImage(info.image || '');
    setNewBrandDescription(info.description || '');
    setIsBrandModalOpen(true);
  };

  const handleUpdateBrand = () => {
    if (!newBrandName.trim() || !editingBrand) {
      alert('Please enter a brand name');
      return;
    }
    
    const updatedInfo = { ...brandsInfo };
    
    // If name changed, remove old entry and create new
    if (editingBrand.name !== newBrandName.trim()) {
      delete updatedInfo[editingBrand.name];
    }
    
    updatedInfo[newBrandName.trim()] = {
      name: newBrandName.trim(),
      image: newBrandImage.trim() || editingBrand.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
      description: newBrandDescription.trim()
    };
    
    saveBrandsInfo(updatedInfo);
    setIsBrandModalOpen(false);
    setEditingBrand(null);
    setNewBrandName('');
    setNewBrandImage('');
    setNewBrandDescription('');
    alert(`Brand "${newBrandName.trim()}" updated successfully!`);
  };

  const handleDeleteBrand = (brandName: string) => {
    if (!confirm(`Delete brand "${brandName}"?\n\nNote: This will only remove the brand metadata. Products with this brand will remain but show without brand image.`)) {
      return;
    }
    
    const updatedInfo = { ...brandsInfo };
    delete updatedInfo[brandName];
    saveBrandsInfo(updatedInfo);
  };

  // Group products by brand
  const brandsData = useMemo((): BrandData[] => {
    const brandMap = new Map<string, AdminProduct[]>();
    
    products.forEach(product => {
      const brand = product.brand || 'Unknown';
      if (!brandMap.has(brand)) {
        brandMap.set(brand, []);
      }
      brandMap.get(brand)!.push(product);
    });

    return Array.from(brandMap.entries())
      .map(([name, products]) => ({
        name,
        productCount: products.length,
        products,
      }))
      .sort((a, b) => b.productCount - a.productCount);
  }, [products]);

  // Get products for selected brand
  const filteredProducts = useMemo(() => {
    if (!selectedBrand) return [];
    return products.filter(p => {
      if (p.brand !== selectedBrand) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.code?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [products, selectedBrand, search]);

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

  const handleUpdateStock = (product: AdminProduct, rawValue: string) => {
    const newStock = parseInt(rawValue, 10);
    if (Number.isNaN(newStock) || newStock < 0) {
      alert('Enter a valid stock quantity (0 or more).');
      return;
    }
    
    setPendingChanges(prev => ({
      ...prev,
      [product.id]: { ...(prev[product.id] || {}), stock_quantity: newStock }
    }));
  };

  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    setLoading(true);
    try {
      for (const [id, changes] of Object.entries(pendingChanges)) {
        const product = products.find(p => p.id === id);
        if (product) {
          const { _source, ...rest } = product;
          await saveAdminProduct({ ...rest, ...changes });
        }
      }
      setPendingChanges({});
      await loadProducts();
      alert('Changes saved successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Failed to save changes: ' + msg);
    } finally {
      setLoading(false);
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

  const handleDeleteAllBrandProducts = async (brandName: string) => {
    const brandProducts = products.filter(p => p.brand === brandName);
    const deletableProducts = brandProducts.filter(p => p._source !== 'catalog');
    
    if (deletableProducts.length === 0) {
      alert(`Cannot delete ${brandName} products. All ${brandProducts.length} products are built-in catalog items.`);
      return;
    }
    
    if (!confirm(`Delete ALL ${deletableProducts.length} deletable products from "${brandName}"?\n\n${brandProducts.length - deletableProducts.length} catalog products will remain but can be hidden.`)) {
      return;
    }

    setLoading(true);
    let deleted = 0;
    let failed = 0;
    
    for (const product of deletableProducts) {
      try {
        await deleteAdminProduct(product.id);
        deleted++;
      } catch (err) {
        console.error(`Failed to delete ${product.name}:`, err);
        failed++;
      }
    }
    
    await loadProducts();
    setLoading(false);
    
    if (failed > 0) {
      alert(`Deleted ${deleted} products. ${failed} failed.`);
    } else {
      alert(`Successfully deleted ${deleted} products from ${brandName}.`);
    }
    
    // Clear selection if no products left
    const remainingProducts = products.filter(p => p.brand === brandName);
    if (remainingProducts.length === 0 || remainingProducts.every(p => p._source === 'catalog')) {
      setSelectedBrand(null);
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

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
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
          <h3 className="text-2xl font-serif text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Brand Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {brandsData.length} brands · {products.length} total products
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={loadProducts} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={handleSyncCatalog} 
            disabled={syncing}
            className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm font-bold flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> 
            {syncing ? 'Syncing...' : 'Sync Catalog'}
          </button>
          <button 
            onClick={handleSaveChanges} 
            disabled={Object.keys(pendingChanges).length === 0} 
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Save Changes
          </button>
          <button 
            onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} 
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h3>
              <button 
                onClick={() => {
                  setIsBrandModalOpen(false);
                  setEditingBrand(null);
                  setNewBrandName('');
                  setNewBrandImage('');
                  setNewBrandDescription('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Image</label>
                
                {/* Image Preview */}
                {newBrandImage && (
                  <div className="mb-3">
                    <img 
                      src={newBrandImage} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
                
                {/* URL Input */}
                <input
                  type="text"
                  value={newBrandImage}
                  onChange={(e) => setNewBrandImage(e.target.value)}
                  placeholder="https://example.com/brand-logo.png"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
                />
                
                {/* Local File Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setNewBrandImage(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload from Computer
                </button>
                <p className="text-xs text-gray-400 mt-1">Or enter a URL above</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBrandDescription}
                  onChange={(e) => setNewBrandDescription(e.target.value)}
                  placeholder="Brief description of the brand..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsBrandModalOpen(false);
                  setEditingBrand(null);
                  setNewBrandName('');
                  setNewBrandImage('');
                  setNewBrandDescription('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
              >
                {editingBrand ? 'Update Brand' : 'Add Brand'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Grid */}
      {!selectedBrand && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {/* Add Brand Card */}
          <div
            onClick={() => {
              setEditingBrand(null);
              setNewBrandName('');
              setNewBrandImage('');
              setNewBrandDescription('');
              setIsBrandModalOpen(true);
            }}
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-7 h-7 text-primary-600" />
            </div>
            <span className="font-bold text-primary-600">Add New Brand</span>
            <span className="text-xs text-gray-400 mt-1">Create a new brand</span>
          </div>
          
          {brandsData.map((brand) => {
            const brandInfo = brandsInfo[brand.name];
            return (
              <div
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {brandInfo?.image ? (
                      <img 
                        src={brandInfo.image} 
                        alt={brand.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-600" />
                    )}
                    <Building2 className="w-7 h-7 text-gray-600 hidden" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBrand(brand.name);
                      }}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      title="Edit brand"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBrand(brand.name);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete brand"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{brand.name}</h4>
                {brandInfo?.description && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{brandInfo.description}</p>
                )}
                <p className="text-xs text-gray-500">{brand.productCount} products</p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBrand(brand.name);
                    }}
                    className="flex-1 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    View Products
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAllBrandProducts(brand.name);
                    }}
                    className="px-2 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete all deletable products from this brand"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Brand Products */}
      {selectedBrand && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedBrand(null)}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              ← Back to Brands
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Editing:</span>
              <span className="font-bold text-gray-900">{selectedBrand}</span>
              <span className="text-sm text-gray-500">({filteredProducts.length} products)</span>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search products..." 
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm" 
            />
            <button
              onClick={() => handleDeleteAllBrandProducts(selectedBrand)}
              className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 hover:bg-red-100"
            >
              <AlertTriangle className="w-4 h-4" />
              Delete All Brand Products
            </button>
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                      {search ? 'No products match your search.' : 'No products found for this brand.'}
                    </td>
                  </tr>
                ) : filteredProducts.map((product) => (
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
                          key={`${product.id}-${pendingChanges[product.id]?.stock_quantity ?? product.stock_quantity}`}
                          defaultValue={pendingChanges[product.id]?.stock_quantity ?? product.stock_quantity}
                          onBlur={(e) => handleUpdateStock(product, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                          }}
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium focus:ring-1 focus:ring-primary-500 outline-none"
                        />
                        {product.stock_quantity === 0 && (
                          <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded">Out</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{sourceBadge(product._source)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} 
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product)} 
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
