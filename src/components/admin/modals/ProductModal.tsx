import React, { useState, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { Product } from '../../../data/products';
import { productCategories } from '../../../lib/adminProducts';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
  product?: Partial<Product> | null;
  readOnly?: boolean;
}

const emptyForm: Partial<Product> = {
  name: '',
  price: 0,
  category: 'Drape Accessories',
  brand: 'Test One',
  image: '',
  stock_quantity: 0,
  description: '',
  rating: 4.5,
  code: '',
  gst: '5%',
};

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  readOnly = false,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({ ...emptyForm, ...product });
      setPreviewUrl(product.image || '');
    } else {
      setFormData(emptyForm);
      setPreviewUrl('');
    }
  }, [product, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setIsSubmitting(true);
    try {
      const num = (v: number | undefined) =>
        v != null && !Number.isNaN(v) ? Number(v) : undefined;

      await onSave({
        ...formData,
        price: Number(formData.price) || 0,
        stock_quantity: Number(formData.stock_quantity) || 0,
        rating: Number(formData.rating) || 4.5,
        mrp: num(formData.mrp),
        mrp_box: num(formData.mrp_box),
        mrp_piece: num(formData.mrp_piece),
        rate_box: num(formData.rate_box),
        rate_piece: num(formData.rate_piece),
      });
      onClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to save product: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const fieldClass =
    'w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all disabled:opacity-60';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-900">{product ? (readOnly ? 'View Product' : 'Edit Product') : 'Add New Product'}</h3>
            <p className="text-xs text-gray-500 mt-1">Test One catalog â€” prices in INR</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input type="text" required disabled={readOnly} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Product Code</label>
              <input type="text" disabled={readOnly} value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input type="text" required disabled={readOnly} value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select disabled={readOnly} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={fieldClass}>
                {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Rate (INR)</label>
              <input type="number" step="0.01" required disabled={readOnly} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>MRP (INR)</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.mrp ?? ''} onChange={(e) => setFormData({ ...formData, mrp: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>GST</label>
              <input type="text" disabled={readOnly} value={formData.gst || ''} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" required disabled={readOnly} value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) })} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Rating</label>
              <input type="number" step="0.1" min="0" max="5" disabled={readOnly} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className={fieldClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea required disabled={readOnly} rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={fieldClass} />
          </div>
        </form>
        {!readOnly ? (
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gold-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
            </button>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 border-t shrink-0">
            <button type="button" onClick={onClose} className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;

