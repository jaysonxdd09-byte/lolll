import React, { useState } from 'react';
import { Upload, Database, AlertTriangle, CheckCircle, FileText, Trash2, Zap } from 'lucide-react';
import { parseProductCSV, importProductsToDatabase, deleteAllProducts } from '../../../lib/importProductsFromCSV';
import { executeFullImport } from '../../../lib/executeProductImport';

export default function ImportProductsTab() {
  const [csvContent, setCsvContent] = useState('');
  const [parsedProducts, setParsedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [step, setStep] = useState<'input' | 'preview' | 'done'>('input');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      
      // Parse the CSV
      const products = parseProductCSV(content);
      setParsedProducts(products);
      setStep('preview');
      
      setResult({
        type: 'success',
        message: `Parsed ${products.length} products from CSV`
      });
    };
    reader.readAsText(file);
  };

  const handlePasteCSV = () => {
    const content = prompt('Paste CSV content here:');
    if (content) {
      setCsvContent(content);
      const products = parseProductCSV(content);
      setParsedProducts(products);
      setStep('preview');
      setResult({
        type: 'success',
        message: `Parsed ${products.length} products from CSV`
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('WARNING: This will delete ALL existing products from the database. Are you sure?')) {
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const { deleted, failed } = await deleteAllProducts();
      setResult({
        type: 'success',
        message: `Deleted ${deleted} products. ${failed > 0 ? `${failed} failed.` : ''}`
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Failed to delete products: ' + (error as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (parsedProducts.length === 0) {
      setResult({ type: 'error', message: 'No products to import' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { success, failed } = await importProductsToDatabase(parsedProducts);
      setResult({
        type: 'success',
        message: `Import complete! ${success} products imported successfully. ${failed > 0 ? `${failed} failed.` : ''}`
      });
      setStep('done');
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Import failed: ' + (error as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  const getBrandCounts = () => {
    const counts: Record<string, number> = {};
    parsedProducts.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const handleExecuteFullImport = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL existing products and import ~110 new products from the CSV.\n\nAre you sure you want to proceed?')) {
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const { deleted, imported, failed, brands } = await executeFullImport();
      setResult({
        type: 'success',
        message: `✅ Import Complete!\n• ${deleted} old products deleted\n• ${imported} new products imported\n• ${failed} failed\n• Brands: ${brands.join(', ')}`
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Import failed: ' + (error as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-serif text-gray-900 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Import Products
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Import products from CSV file. This will replace all existing products.
        </p>
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${result.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          {result.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <p className={`text-sm ${result.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
            {result.message}
          </p>
        </div>
      )}

      {/* One-Click Full Import */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-6 text-white">
        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          One-Click Full Import
        </h4>
        <p className="text-white/80 text-sm mb-4">
          Delete all existing products and import ~110 products from Sheet4.csv automatically.
          This includes products from 3M, Smith & Nephew, Surgiwear, BSN Essity, Paramount, etc.
        </p>
        <button
          onClick={handleExecuteFullImport}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-white text-primary-600 font-bold flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Execute Full Import
            </>
          )}
        </button>
      </div>

      {/* Step 1: Delete existing products */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          Step 1: Clear Existing Products
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          First, delete all existing products from the database. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAll}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Delete All Products
        </button>
      </div>

      {/* Step 2: Upload CSV */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          Step 2: Upload Product CSV
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
          
          <div className="text-center">
            <span className="text-gray-400 text-sm">— OR —</span>
          </div>
          
          <button
            onClick={handlePasteCSV}
            className="w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 text-gray-600 text-sm hover:border-primary-300 hover:text-primary-600 transition-colors"
          >
            Paste CSV Content
          </button>
        </div>
      </div>

      {/* Preview */}
      {step === 'preview' && parsedProducts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="font-bold text-gray-900 mb-4">
            Preview: {parsedProducts.length} Products
          </h4>
          
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-600 mb-2">Brands breakdown:</h5>
            <div className="flex flex-wrap gap-2">
              {getBrandCounts().map(([brand, count]) => (
                <span key={brand} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                  {brand}: {count}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-64 overflow-y-auto border border-gray-100 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase">Brand</th>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase">Product Name</th>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase">MRP</th>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parsedProducts.slice(0, 20).map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs">{product.brand}</td>
                    <td className="px-3 py-2 text-xs font-medium">{product.name}</td>
                    <td className="px-3 py-2 text-xs">₹{product.mrp}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{product.packing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedProducts.length > 20 && (
              <p className="text-center text-xs text-gray-400 py-2">
                ... and {parsedProducts.length - 20} more products
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setStep('input')}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Import {parsedProducts.length} Products
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h4 className="font-bold text-emerald-900 mb-2">Import Complete!</h4>
          <p className="text-emerald-700 text-sm mb-4">
            Products have been successfully imported to the database.
          </p>
          <button
            onClick={() => { setStep('input'); setParsedProducts([]); setCsvContent(''); setResult(null); }}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
}
