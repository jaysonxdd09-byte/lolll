import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, ArrowRight, User, Clock } from 'lucide-react';
import { loadCollection } from '../lib/contentStore';
import { BlogPost } from './BlogsSection';

interface BlogsPageProps {
  onBack: () => void;
  onBlogClick: (blog: BlogPost) => void;
}

const defaultBlogs: BlogPost[] = [
  {
    id: 'b-1',
    title: 'How To Choose The Right Surgical Instruments',
    excerpt: 'A practical checklist for hospitals and clinics to source reliable, compliant instruments.',
    author: 'QA Team',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-2',
    title: 'Understanding ISO 13485 For Procurement Teams',
    excerpt: 'What this standard means in day-to-day buying decisions and quality audits.',
    author: 'Compliance Desk',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-3',
    title: 'Cold Chain Basics For Medical Distribution',
    excerpt: 'Key controls to preserve product integrity across long-distance healthcare delivery.',
    author: 'Logistics Team',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
  },
];

export default function BlogsPage({ onBack, onBlogClick }: BlogsPageProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await loadCollection<BlogPost>('blogs', { column: 'created_at', ascending: false }, defaultBlogs);
      setBlogs(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-32 pb-20">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors group mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 block mb-2">Our Insights</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-gray-900">The <span className="text-gold-600">Health Journal</span></h1>
          <p className="text-gray-500 mt-4 max-w-2xl text-sm leading-relaxed">Stay updated with the latest trends in medical technology, institutional procurement, and healthcare distribution standards.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <motion.article 
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => onBlogClick(blog)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={blog.image || defaultBlogs[0].image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white">Articles</span>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {new Date(blog.created_at || Date.now()).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 min read</div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight mb-4 group-hover:text-gold-600 transition-colors line-clamp-2">{blog.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gold-50 rounded-full flex items-center justify-center"><User className="w-3.5 h-3.5 text-gold-600" /></div>
                      <span className="text-[11px] font-bold text-gray-600">{blog.author || 'Test One Team'}</span>
                    </div>
                    <span className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gold-500 group-hover:text-white transition-all"><ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
