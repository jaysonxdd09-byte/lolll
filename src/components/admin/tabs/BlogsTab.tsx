import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Image as ImageIcon, X } from 'lucide-react';
import { BlogPost } from '../../BlogsSection';
import { deleteRecord, loadCollection, upsertRecord } from '../../../lib/contentStore';

const defaults: BlogPost[] = [];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const emptyBlog: BlogPost = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  author: '',
};

export default function BlogsTab() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogPost>(emptyBlog);
  const [error, setError] = useState('');

  const isEdit = useMemo(() => Boolean(form.id), [form.id]);

  const fetchBlogs = async () => {
    setLoading(true);
    const data = await loadCollection<BlogPost>('blogs', { column: 'created_at', ascending: false }, defaults);
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setForm((prev) => ({ ...prev, image: url }));
  };

  const resetModal = () => {
    setForm(emptyBlog);
    setError('');
    setOpen(false);
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.excerpt?.trim()) {
      setError('Title and excerpt are required.');
      return;
    }
    setSaving(true);
    setError('');
    await upsertRecord<BlogPost>('blogs', {
      ...form,
      id: form.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: form.author || 'Admin Team',
      created_at: form.created_at || new Date().toISOString(),
    });
    setSaving(false);
    resetModal();
    fetchBlogs();
  };

  const onEdit = (blog: BlogPost) => {
    setForm(blog);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await deleteRecord('blogs', id);
    fetchBlogs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-serif text-gray-900">Blogs</h3>
        <button
          onClick={() => {
            setForm(emptyBlog);
            setOpen(true);
          }}
          className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Blog
        </button>
      </div>

      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No blogs yet. Create your first post.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="border border-gray-200 rounded-2xl p-4 flex gap-4 items-center group">
              <div className="w-24 h-20 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-5 h-5" /></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">{blog.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(blog)} className="p-2.5 text-gray-400 hover:text-gold-600 bg-gray-50 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(blog.id)} className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[140] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-xl font-serif text-gray-900">{isEdit ? 'Edit Blog' : 'Create Blog'}</h4>
              <button onClick={resetModal} className="p-2 rounded-lg hover:bg-gray-50 text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={onSave} className="space-y-3">
              <input value={form.title || ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Blog title" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <input value={form.author || ''} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} placeholder="Author" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <textarea value={form.excerpt || ''} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Short excerpt" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[90px] outline-none focus:border-gold-500" />
              <textarea value={form.content || ''} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Full content" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[140px] outline-none focus:border-gold-500" />
              <input value={form.image || ''} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL (optional)" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <div className="rounded-xl border border-dashed border-gray-300 p-3">
                <label className="text-xs font-semibold text-gray-500 block mb-2">Upload image</label>
                <input type="file" accept="image/*" onChange={onFile} className="text-xs" />
              </div>
              {form.image && <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-100" />}
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button type="submit" disabled={saving} className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest">
                {saving ? 'Saving...' : isEdit ? 'Update Blog' : 'Publish Blog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
