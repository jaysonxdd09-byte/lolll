import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import ProductModal from '../modals/ProductModal';

export default function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productData: any) => {
    try {
      if (productData.id) {
        const { error } = await supabase.from('products').update(productData).eq('id', productData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      throw err;
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    await supabase.from('products').update({ stock_quantity: newStock }).eq('id', id);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        fetchProducts();
      } catch (err: any) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product: ' + (err.message || 'Unknown error'));
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div>
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        product={selectedProduct} 
      />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-serif text-gray-900">Products</h3>
        <button 
          onClick={handleAdd}
          className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Product</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Price</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Category</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Stock</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={product.stock_quantity}
                      onBlur={(e) => handleUpdateStock(product.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs font-medium focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                    {product.stock_quantity === 0 && (
                      <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded tracking-tighter">Out</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
  );
}
