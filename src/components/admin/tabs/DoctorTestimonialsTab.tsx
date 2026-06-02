import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Video, User, Save, X, Upload, Star } from 'lucide-react';

interface DoctorTestimonial {
  id: string;
  name: string;
  title: string;
  hospital: string;
  specialty: string;
  avatar: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  rating: number;
  quote: string;
}

const defaultTestimonials: DoctorTestimonial[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Senior Cardiologist',
    hospital: 'AIIMS Delhi',
    specialty: 'Cardiology',
    avatar: '',
    videoUrl: '',
    thumbnail: '',
    duration: '0:45',
    rating: 5,
    quote: 'Test One Medical supplies have been exceptional in quality. The surgical drapes and gowns meet international standards.'
  }
];

export default function DoctorTestimonialsTab() {
  const [testimonials, setTestimonials] = useState<DoctorTestimonial[]>(() => {
    const saved = localStorage.getItem('test_one_doctor_testimonials');
    return saved ? JSON.parse(saved) : defaultTestimonials;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<DoctorTestimonial | null>(null);
  const [formData, setFormData] = useState<Partial<DoctorTestimonial>>({
    name: '',
    title: '',
    hospital: '',
    specialty: '',
    avatar: '',
    videoUrl: '',
    thumbnail: '',
    duration: '0:30',
    rating: 5,
    quote: ''
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const saveToStorage = (data: DoctorTestimonial[]) => {
    localStorage.setItem('test_one_doctor_testimonials', JSON.stringify(data));
    setTestimonials(data);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      title: '',
      hospital: '',
      specialty: '',
      avatar: '',
      videoUrl: '',
      thumbnail: '',
      duration: '0:30',
      rating: 5,
      quote: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial: DoctorTestimonial) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const updated = testimonials.filter(t => t.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.title || !formData.hospital) {
      alert('Please fill in all required fields');
      return;
    }

    const newTestimonial: DoctorTestimonial = {
      id: editingTestimonial?.id || Date.now().toString(),
      name: formData.name || '',
      title: formData.title || '',
      hospital: formData.hospital || '',
      specialty: formData.specialty || '',
      avatar: formData.avatar || '',
      videoUrl: formData.videoUrl || '',
      thumbnail: formData.thumbnail || '',
      duration: formData.duration || '0:30',
      rating: formData.rating || 5,
      quote: formData.quote || ''
    };

    let updated: DoctorTestimonial[];
    if (editingTestimonial) {
      updated = testimonials.map(t => t.id === editingTestimonial.id ? newTestimonial : t);
    } else {
      updated = [...testimonials, newTestimonial];
    }

    saveToStorage(updated);
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctor Testimonials</h2>
          <p className="text-sm text-gray-500 mt-1">Manage video testimonials from doctors</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{testimonial.name}</h3>
                <p className="text-xs text-gray-500 truncate">{testimonial.title}</p>
                <p className="text-xs text-gray-400 truncate">{testimonial.hospital}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                {testimonial.specialty}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> {testimonial.rating}.0
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {testimonial.duration}
              </span>
            </div>

            {testimonial.videoUrl && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Video className="w-4 h-4" />
                <span>Video uploaded</span>
              </div>
            )}

            {testimonial.quote && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-2 italic">
                "{testimonial.quote}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Dr. Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. Senior Cardiologist"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={e => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. AIIMS Delhi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={e => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. Cardiology"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. 0:45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating}
                    onChange={e => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'avatar')}
                    className="hidden"
                  />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Thumbnail</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {formData.thumbnail ? (
                      <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <Video className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'thumbnail')}
                    className="hidden"
                  />
                  <button
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {formData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                  </button>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (or embed link)</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={e => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">You can also use a video file URL or embed from YouTube/Vimeo</p>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Quote</label>
                <textarea
                  value={formData.quote}
                  onChange={e => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent h-24 resize-none"
                  placeholder="Enter the doctor's testimonial quote..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" /> Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
