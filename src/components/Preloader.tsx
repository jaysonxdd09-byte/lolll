import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LOADER_DURATION_MS = 1500;

interface PreloaderProps {
  isLoading: boolean;
}

const Preloader: React.FC<PreloaderProps> = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    let rafId = 0;
    let hideTimer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / LOADER_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed < LOADER_DURATION_MS) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        hideTimer = setTimeout(() => setIsVisible(false), 150);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-8"
        >
          <div className="relative max-w-sm w-full space-y-12 text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center"
            >
              <img 
                src="/images/loading/loading.png" 
                alt="Test One Medical Solutions" 
                className="w-full h-auto max-w-[280px] sm:max-w-[360px]"
              />
            </motion.div>

            {/* Progress Container */}
            <div className="space-y-4">
              <div className="relative h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="absolute inset-y-0 left-0 bg-gold-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                />
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Initializing Systems
                </motion.span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-[10px] font-bold text-gold-600/60 uppercase tracking-[0.4em] pt-4"
            >
              Precision • Quality • Excellence
            </motion.p>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
