import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const quotes = [
  { text: "The gold standard in our surgical suites.", author: "Dr. James Wilson", role: "Chief of Surgery" },
  { text: "Exceptional quality and reliable delivery every time.", author: "Sarah Chen", role: "Procurement Director" },
  { text: "Test One instruments have transformed our diagnostic accuracy.", author: "Dr. Maria Garcia", role: "Head of Diagnostics" },
  { text: "Uncompromising precision. A partner we trust.", author: "Robert Taylor", role: "Hospital Administrator" },
  { text: "The best medical supplies we have ever procured.", author: "Dr. Emily Roberts", role: "Clinical Lead" },
  { text: "Outstanding durability. Highly recommended.", author: "Michael Chang", role: "Supply Chain Manager" },
];

const SloganMarquee: React.FC = () => {
  return (
    <div className="bg-gray-900 py-6 overflow-hidden border-y border-primary-900/30 relative">
      {/* Gradient overlays for smooth fading edges */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10" />
      
      <div className="flex w-[200%] sm:w-[150%] md:w-[120%] lg:w-max">
        <motion.div 
          className="flex gap-8 px-4"
          animate={{ x: [0, -1035] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* We render the list multiple times to create a seamless loop */}
          {[...quotes, ...quotes, ...quotes].map((quote, idx) => (
            <div key={idx} className="flex flex-col min-w-[280px] sm:min-w-[320px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 flex-shrink-0">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 text-primary-400 fill-primary-400" />
                ))}
              </div>
              <p className="text-white text-sm sm:text-base font-serif italic mb-3">"{quote.text}"</p>
              <div className="mt-auto">
                <p className="text-primary-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{quote.author}</p>
                <p className="text-gray-400 text-[9px] sm:text-[10px] font-medium">{quote.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SloganMarquee;

