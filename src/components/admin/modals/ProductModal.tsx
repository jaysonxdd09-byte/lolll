import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  stock_quantity: number;
  description: string;
  features?: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  product?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    category: 'Surgical Supplies',
    brand: '',
    image: '',
    stock_quantity: 0,
    description: '',
    features: []
  });
  const [featuresText, setFeaturesText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setPreviewUrl(product.image);
      setFeaturesText(product.features?.join(', ') || '');
    } else {
      setFormData({
        name: '',
        price: 0,
        category: 'Surgical Supplies',
        brand: '',
        image: '',
        stock_quantity: 0,
        description: '',
        features: []
      });
      setPreviewUrl('');
      setFeaturesText('');
    }
  }, [product, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        setFormData(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalData = {
        ...formData,
        features: featuresText.split(',').map(f => f.trim()).filter(f => f !== '')
      };
      await onSave(finalData);
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      const msg = error.message || '';
      if (msg.includes('infinite recursion') || msg.includes('42P17')) {
        alert('CRITICAL ERROR: Database Security Policies (RLS) are broken. Please run the SQL fix I provided in the chat to enable saving.');
      } else {
        alert('Failed to save product: ' + msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-serif font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                  placeholder="e.g. Surgical Scalpel"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Brand</label>
                <input 
                  type="text" 
                  required
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                  placeholder="e.g. TestOne Medical"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock_quantity}
                  onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
            >
              <option>Catheters & Drainages</option>
              <option>Orthopaedic Products</option>
              <option>Ostomy Care</option>
              <option>Surgical Supplies</option>
              <option>Syringes & Needles</option>
              <option>Wound Care</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
              placeholder="Enter product description..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Features (comma separated)</label>
            <input 
              type="text" 
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
              placeholder="e.g. Sterile, Single-use, Stainless steel"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Image</label>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden relative group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Upload</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1 space-y-2 text-[11px] text-gray-500">
                <p className="flex items-center gap-2"><Save className="w-3 h-3" /> Image will be stored as Base64.</p>
                <p className="text-gold-600 font-bold">Square aspect ratio recommended.</p>
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gold-600 text-white rounded-xl font-bold text-sm hover:bg-gold-700 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
