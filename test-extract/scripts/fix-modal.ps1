$tag = 'di' + 'v'
$path = Join-Path $PSScriptRoot '..\src\components\admin\modals\ProductModal.tsx'
$c = Get-Content $path -Raw

$open = "<$tag"
$close = "</$tag>"
$self = "<$tag />"

$inner = @"
      <$tag className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <$tag className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <$tag>
            <h3 className="text-xl font-serif font-bold text-gray-900">{product ? (readOnly ? 'View Product' : 'Edit Product') : 'Add New Product'}</h3>
            <p className="text-xs text-gray-500 mt-1">Test One catalog — prices in INR</p>
          </$tag>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
        </$tag>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <$tag className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <$tag>
              <label className={labelClass}>Product Name</label>
              <input type="text" required disabled={readOnly} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>Product Code</label>
              <input type="text" disabled={readOnly} value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>Brand</label>
              <input type="text" required disabled={readOnly} value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>Category</label>
              <select disabled={readOnly} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={fieldClass}>
                {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </$tag>
            <$tag>
              <label className={labelClass}>Rate (INR)</label>
              <input type="number" step="0.01" required disabled={readOnly} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>MRP (INR)</label>
              <input type="number" step="0.01" disabled={readOnly} value={formData.mrp ?? ''} onChange={(e) => setFormData({ ...formData, mrp: e.target.value ? parseFloat(e.target.value) : undefined })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>GST</label>
              <input type="text" disabled={readOnly} value={formData.gst || ''} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>Stock</label>
              <input type="number" required disabled={readOnly} value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) })} className={fieldClass} />
            </$tag>
            <$tag>
              <label className={labelClass}>Rating</label>
              <input type="number" step="0.1" min="0" max="5" disabled={readOnly} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className={fieldClass} />
            </$tag>
          </$tag>
          <$tag>
            <label className={labelClass}>Description</label>
            <textarea required disabled={readOnly} rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={fieldClass} />
          </$tag>
        </form>
        {!readOnly ? (
          <$tag className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gold-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
            </button>
          </$tag>
        ) : (
          <$tag className="p-6 bg-gray-50 border-t shrink-0">
            <button type="button" onClick={onClose} className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">Close</button>
          </$tag>
        )}
      </$tag>
"@

$c = $c -replace '<motionless />', $inner
Set-Content $path $c -Encoding utf8
Write-Host 'fixed'
