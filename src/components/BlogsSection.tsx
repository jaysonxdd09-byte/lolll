import { useEffect, useState } from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { loadCollection } from '../lib/contentStore';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  author?: string;
  created_at?: string;
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

export default function BlogsSection({ onBlogClick, onViewAll }: { onBlogClick?: (blog: BlogPost) => void, onViewAll?: () => void }) {
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
    <section id="blogs" className="py-14 sm:py-20 bg-white">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500">Insights</span>
            <h2 className="text-2xl sm:text-4xl font-serif text-gray-900 mt-3">Latest <span className="text-gold-600">Blogs</span></h2>
          </div>
          <button onClick={onViewAll} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gold-600 transition-colors">
            View All Journals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-sm text-gray-400">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <article 
                key={blog.id} 
                onClick={() => onBlogClick?.(blog)}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img
                    src={blog.image || defaultBlogs[0].image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(blog.created_at || Date.now()).toLocaleDateString()}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{blog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">{blog.author || 'Test One Team'}</span>
                    <span className="text-xs font-bold text-gold-600 flex items-center gap-1">Read <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
