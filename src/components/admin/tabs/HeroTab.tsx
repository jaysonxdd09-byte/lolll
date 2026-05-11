import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import HeroModal from '../modals/HeroModal';

export default function HeroTab() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      if (data) setSlides(data);
    } catch (err) {
      console.error('Error fetching slides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (slideData: any) => {
    try {
      if (slideData.id) {
        const { error } = await supabase.from('hero_slides').update(slideData).eq('id', slideData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('hero_slides').insert([slideData]);
        if (error) throw error;
      }
      fetchSlides();
    } catch (err) {
      console.error('Error saving slide:', err);
      throw err;
    }
  };

  const handleEdit = (slide: any) => {
    setSelectedSlide(slide);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSlide(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) throw error;
        fetchSlides();
      } catch (err: any) {
        console.error('Error deleting slide:', err);
        alert('Failed to delete slide: ' + (err.message || 'Unknown error'));
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
      <HeroModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        slide={selectedSlide} 
      />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-serif text-gray-900">Hero Banner Management</h3>
        <button 
          onClick={handleAdd}
          className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No hero slides found. Add your first one to get started.</p>
          </div>
        ) : slides.map((slide) => (
          <div key={slide.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-6 items-center hover:shadow-md transition-all group">
            <div className="w-48 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
              {slide.image ? (
                <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400" /></div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500 bg-gold-50 px-2 py-0.5 rounded">{slide.badge}</span>
                <span className="text-xs text-gray-400">Order: {slide.order_index}</span>
              </div>
              <h4 className="text-lg font-serif text-gray-900">{slide.title_1} {slide.title_2}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{slide.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(slide)}
                className="p-2.5 text-gray-400 hover:text-gold-600 transition-colors bg-gray-50 hover:bg-gold-50 rounded-xl"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(slide.id)} 
                className="p-2.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
