import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExplore?: () => void;
  slides?: any[];
}

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1583912267509-a1b3861038a3?auto=format&fit=crop&q=80&w=2000',
    title: ['Advanced', 'Diagnostics.'],
    subtitle: 'Uncompromising precision meets state-of-the-art diagnostic technology. Elevate your laboratory standards with our primary-tier solutions.',
    badge: 'Clinical Excellence'
  },
  {
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000',
    title: ['Surgical', 'Perfection.'],
    subtitle: 'Engineered for the hands that heal. Experience ergonomic, high-grade instrumentation designed for complex procedures.',
    badge: 'Precision Surgical'
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000',
    title: ['Future', 'of Care.'],
    subtitle: 'Integrated medical solutions that bridge the gap between innovation and patient outcomes. Safety, refined.',
    badge: 'Medical Innovation'
  },
  {
    image: 'https://images.unsplash.com/photo-1516841273312-763266e5114c?auto=format&fit=crop&q=80&w=2000',
    title: ['Global', 'Standards.'],
    subtitle: 'Reliable, scalable, and globally certified. We provide the essential infrastructure for modern healthcare ecosystems.',
    badge: 'Worldwide Trusted'
  }
];

export default function Hero({ onExplore, slides: dbSlides }: HeroProps) {
  const [current, setCurrent] = useState(0);

  // Format db slides to match expected shape
  // Format db slides to match expected shape with safety fallbacks
  const activeSlides = dbSlides && dbSlides.length > 0 
    ? dbSlides.map(s => {
        // Handle title - could be string or need to split
        let titleArray = ['Medical', 'Solutions'];
        if (s?.title) {
          const titleParts = s.title.split(/[.\-–—]/).map((p: string) => p.trim()).filter((p: string) => p);
          if (titleParts.length >= 2) {
            titleArray = [titleParts[0], titleParts.slice(1).join(' ')];
          } else {
            titleArray = [s.title, ''];
          }
        }
        return {
          image: s?.image_url || s?.image || defaultSlides[0].image,
          title: titleArray,
          subtitle: s?.subtitle || 'High-quality medical instruments and equipment.',
          badge: s?.badge || 'Quality Assured'
        };
      })
    : defaultSlides;

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const goTo = (index: number) => setCurrent(index);
  const goPrev = () => setCurrent(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  const goNext = () => setCurrent(prev => (prev + 1) % activeSlides.length);

  return (
    <div className="relative overflow-hidden bg-white pt-28 sm:pt-40 pb-8 sm:pb-16 px-3 sm:px-6 lg:px-0 font-sans mt-2">
      <div className="max-w-[95%] mx-auto">
        <div className="relative w-full min-h-[430px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-[48px] overflow-hidden border border-primary-100 shadow-[0_32px_64px_-16px_rgba(212,175,55,0.15)] bg-gray-900 group">
          
          {/* Slideshow Background Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeSlides[current].image}
                alt={activeSlides[current].badge}
                className="w-full h-full object-cover object-center sm:object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/75 to-gray-900/30 sm:via-gray-900/60 sm:to-gray-900/20 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 via-transparent to-transparent z-10" />
            </motion.div>
          </AnimatePresence>

          {/* Content Layer */}
          <div className="relative z-20 h-full flex flex-col justify-end sm:justify-center p-4 sm:p-10 lg:p-16 pb-14 sm:pb-10 min-h-[430px] sm:min-h-[380px] lg:min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/20 mb-3 sm:mb-8">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary-100">{activeSlides[current].badge}</span>
                </div>

                <h1 className="text-[30px] sm:text-5xl lg:text-[80px] font-serif leading-[1.02] sm:leading-[0.95] text-white tracking-tight sm:tracking-tighter">
                  {activeSlides[current].title[0]} <br />
                  <span className="text-primary-400 font-light drop-shadow-2xl">{activeSlides[current].title[1]}</span>
                </h1>

                <p className="mt-3 sm:mt-8 text-gray-300 text-[13px] sm:text-base lg:text-xl max-w-xl leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                  {activeSlides[current].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Buttons */}
            <div className="mt-5 sm:mt-10 flex flex-col sm:flex-row gap-2.5 sm:gap-4">
              <button onClick={onExplore} className="group relative bg-primary-500 text-white w-full sm:w-auto justify-center px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all transform hover:scale-[1.03] active:scale-95 shadow-2xl shadow-primary-500/40 flex items-center gap-3 overflow-hidden hover:shadow-primary-400/60">
                <span className="relative z-10 text-[10px] sm:text-xs uppercase tracking-widest group-hover:text-gray-900 transition-colors duration-500">Explore Collection</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 group-hover:translate-x-1 group-hover:text-gray-900 transition-all duration-300" />
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white/20 hover:border-primary-400 transition-all active:scale-95">
                Technical Support
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 sm:mt-14 hidden sm:flex flex-wrap items-center gap-6 lg:gap-12">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-primary-400" /></div>
                <div><div className="text-[10px] font-bold uppercase tracking-widest text-primary-200">Safety First</div><div className="text-[9px] text-gray-400">CE & FDA Certified</div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><Zap className="w-4 h-4 text-primary-400" /></div>
                <div><div className="text-[10px] font-bold uppercase tracking-widest text-primary-200">Fast Delivery</div><div className="text-[9px] text-gray-400">Global Logistics</div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><Globe className="w-4 h-4 text-primary-400" /></div>
                <div><div className="text-[10px] font-bold uppercase tracking-widest text-primary-200">ISO Standards</div><div className="text-[9px] text-gray-400">ISO 13485:2016</div></div>
              </div>
            </div>
          </div>

          {/* Slide Navigation Arrows */}
          <button onClick={goPrev} className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full hidden sm:flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={goNext} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full hidden sm:flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-500 rounded-full ${
                  idx === current 
                    ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-primary-400' 
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

