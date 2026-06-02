import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';

interface HeroSlide {
  id?: string;
  title_1: string;
  title_2: string;
  subtitle: string;
  badge: string;
  image: string;
  order_index: number;
}

interface HeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slide: HeroSlide) => Promise<void>;
  slide?: HeroSlide | null;
}

const HeroModal: React.FC<HeroModalProps> = ({ isOpen, onClose, onSave, slide }) => {
  const [formData, setFormData] = useState<HeroSlide>({
    title_1: '',
    title_2: '',
    subtitle: '',
    badge: '',
    image: '',
    order_index: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (slide) {
      setFormData(slide);
      setPreviewUrl(slide.image);
    } else {
      setFormData({
        title_1: '',
        title_2: '',
        subtitle: '',
        badge: '',
        image: '',
        order_index: 0
      });
      setPreviewUrl('');
    }
  }, [slide, isOpen]);

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
      await onSave(formData);
      onClose();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      const msg = error.message || '';
      if (msg.includes('infinite recursion') || msg.includes('42P17')) {
        alert('CRITICAL ERROR: Database Security Policies (RLS) are broken. Please run the SQL fix I provided in the chat to enable saving.');
      } else {
        alert('Failed to save slide: ' + msg);
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
          <h3 className="text-xl font-serif font-bold text-gray-900">{slide ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Title Part 1</label>
                <input 
                  type="text" 
                  required
                  value={formData.title_1}
                  onChange={e => setFormData({ ...formData, title_1: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="e.g. Quality"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Title Part 2</label>
                <input 
                  type="text" 
                  required
                  value={formData.title_2}
                  onChange={e => setFormData({ ...formData, title_2: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="e.g. Assured"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Badge Text</label>
                <input 
                  type="text" 
                  required
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="e.g. ISO CERTIFIED"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Order Index</label>
                <input 
                  type="number" 
                  required
                  value={formData.order_index}
                  onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description / Subtitle</label>
            <textarea 
              required
              rows={2}
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Enter slide description..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Slide Image (Local Upload)</label>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-64 h-36 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden relative group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Upload className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
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
                <p className="flex items-center gap-2"><Save className="w-3 h-3" /> Image will be stored as Base64 in the database.</p>
                <p className="flex items-center gap-2 text-primary-600 font-bold"><AlertCircle className="w-3 h-3" /> Recommended size: 1920x1080px</p>
                <p>Large images may slow down the site.</p>
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
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Slide</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroModal;

