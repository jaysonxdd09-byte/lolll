import fs from 'fs';

const path = 'src/components/admin/modals/ProductModal.tsx';
const head = fs.readFileSync(path, 'utf8').split('  return (')[0];

const tail = `
  return (
    <motionless />
  );
};

export default ProductModal;
`;

// Fix: use actual tag name
const tag = 'div';
const open = (cls, extra = '') => `<${tag} className="${cls}"${extra}>`;
const close = `</${tag}>`;
const self = (cls) => `<${tag} className="${cls}" />`;

const modal = `
  return (
    ${open('fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm')}
      ${open('bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col')}
        ${open('flex justify-between items-center p-6 border-b border-gray-100 shrink-0')}
          ${open('')}
            <h3 className="text-xl font-serif font-bold text-gray-900">{product ? (readOnly ? 'View Product' : 'Edit Product') : 'Add New Product'}</h3>
            <p className="text-xs text-gray-500 mt-1">Test One catalog — prices in INR</p>
          ${close}
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
        ${close}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          ${open('grid grid-cols-1 md:grid-cols-2 gap-4')}
            ${open('')}
              <label className={labelClass}>Product Name</label>
              <input type="text" required disabled={readOnly} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>Product Code</label>
              <input type="text" disabled={readOnly} value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className={fieldClass} placeholder="XP306" />
            ${close}
            ${open('')}
              <label className={labelClass}>Brand</label>
              <input type="text" required disabled={readOnly} value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>Category</label>
              <select disabled={readOnly} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={fieldClass}>
                {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            ${close}
            ${open('')}
              <label className={labelClass}>Rate (INR)</label>
              <input type="number" step="0.01" required disabled={readOnly} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>MRP (INR)</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.mrp ?? ''} onChange={(e) => setFormData({ ...formData, mrp: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>GST</label>
              <input type="text" disabled={readOnly} value={formData.gst || ''} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} className={fieldClass} placeholder="5%" />
            ${close}
            ${open('')}
              <label className={labelClass}>Stock</label>
              <input type="number" required disabled={readOnly} value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>Rating</label>
              <input type="number" step="0.1" min="0" max="5" disabled={readOnly} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className={fieldClass} />
            ${close}
          ${close}
          ${open('grid grid-cols-2 md:grid-cols-4 gap-4')}
            ${open('')}
              <label className={labelClass}>MRP Box</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.mrp_box ?? ''} onChange={(e) => setFormData({ ...formData, mrp_box: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>MRP Piece</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.mrp_piece ?? ''} onChange={(e) => setFormData({ ...formData, mrp_piece: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>Rate Box</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.rate_box ?? ''} onChange={(e) => setFormData({ ...formData, rate_box: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            ${close}
            ${open('')}
              <label className={labelClass}>Rate Piece</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.rate_piece ?? ''} onChange={(e) => setFormData({ ...formData, rate_piece: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            ${close}
          ${close}
          ${open('')}
            <label className={labelClass}>Description</label>
            <textarea required disabled={readOnly} rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={fieldClass} />
          ${close}
          ${open('')}
            <label className={labelClass}>Image URL or upload</label>
            <input type="text" disabled={readOnly} value={formData.image} onChange={(e) => { setFormData({ ...formData, image: e.target.value }); setPreviewUrl(e.target.value); }} className={fieldClass} placeholder="/images/..." />
            ${!readOnly && open('flex gap-4 mt-3 items-start')}
              ${open('w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative')}
                {previewUrl ? <img src={previewUrl} alt="" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 m-auto mt-8 text-gray-400" />}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              ${close}
            ${!readOnly ? close : ''}
          ${close}
        </form>
        ${!readOnly ? open('p-6 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0') : ''}
          {!readOnly && <>
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gold-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
            </button>
          </>}
        ${!readOnly ? close : ''}
        {readOnly && (
          ${open('p-6 bg-gray-50 border-t shrink-0')}
            <button type="button" onClick={onClose} className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">Close</button>
          ${close}
        )}
      ${close}
    ${close}
  );
};

export default ProductModal;
`;

fs.writeFileSync(path, head + modal);
console.log('patched', path);
