import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, User, Clock, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { BlogPost } from './BlogsSection';

interface BlogDetailsPageProps {
  blog: BlogPost;
  onBack: () => void;
}

export default function BlogDetailsPage({ blog, onBack }: BlogDetailsPageProps) {
  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors group mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Journal</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-6">
            <span className="bg-gold-50 px-3 py-1 rounded-full">Medical Insights</span>
            <div className="flex items-center gap-2 text-gray-400"><CalendarDays className="w-3.5 h-3.5" /> {new Date(blog.created_at || Date.now()).toLocaleDateString()}</div>
            <div className="flex items-center gap-2 text-gray-400"><Clock className="w-3.5 h-3.5" /> 8 min read</div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-gray-900 leading-tight mb-8">{blog.title}</h1>

          <div className="flex items-center justify-between py-8 border-y border-gray-100 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center"><User className="w-5 h-5 text-gold-600" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Written by</p>
                <p className="text-sm font-bold text-gray-900">{blog.author || 'Test One Editorial Team'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Facebook className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sky-50 hover:text-sky-500 transition-colors"><Twitter className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-100 hover:text-blue-700 transition-colors"><Linkedin className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"><MessageCircle className="w-4 h-4" /></button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="aspect-[21/9] rounded-[40px] overflow-hidden mb-12 shadow-2xl">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </motion.div>

        <div className="prose prose-lg max-w-none prose-serif prose-gold">
          <p className="text-xl text-gray-600 leading-relaxed font-light italic mb-8 border-l-4 border-gold-500 pl-8">
            {blog.excerpt}
          </p>
          
          <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
            <p>At Test One Medical, we believe that understanding the nuances of medical equipment procurement is essential for modern healthcare institutions. The complexities of ensuring quality, compliance, and timely delivery require a strategic approach that balances budget constraints with clinical excellence.</p>
            
            <h2 className="text-2xl font-serif text-gray-900 mt-12 mb-4">The Importance of Standardization</h2>
            <p>One of the key takeaways from our recent analysis is the critical role of standardization in surgical instrument sets. By standardizing on high-quality materials and consistent manufacturing processes, hospitals can significantly reduce cross-contamination risks and improve long-term durability of their assets.</p>
            
            <p>Our commitment to ISO 13485 standards ensures that every product passing through our distribution network meets the highest benchmarks of quality control. This isn't just about regulatory compliance; it's about patient safety and surgical outcomes.</p>

            <blockquote className="bg-gray-50 p-8 rounded-3xl border border-gray-100 my-12">
              <p className="text-gray-900 font-serif text-xl">"Innovation in healthcare isn't just about the newest technology; it's about making the most reliable technology accessible to every clinician."</p>
              <cite className="block mt-4 text-xs font-bold uppercase tracking-widest text-gold-600">— Clinical Procurement Review, 2024</cite>
            </blockquote>

            <h2 className="text-2xl font-serif text-gray-900 mt-12 mb-4">Looking Forward</h2>
            <p>As we continue to expand our presence across the nation, we remain focused on bridging the gap between global manufacturing standards and local healthcare needs. Stay tuned for more insights as we explore the future of medical supply chains.</p>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="bg-gold-500 rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-serif mb-4">Join our professional network</h3>
              <p className="text-white/80 max-w-xl mb-8">Receive exclusive updates on institutional pricing, new product launches, and medical distribution trends across India.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Your work email" className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 outline-none focus:bg-white/20 transition-all placeholder:text-white/60 flex-1" />
                <button className="bg-white text-gold-600 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Subscribe Now</button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
