import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 7000, suffix: '+', label: 'Satisfied Clients' },
  { value: 150,  suffix: '+', label: 'Working Staff' },
  { value: 3,    suffix: '+', label: 'Mfg. Units' },
  { value: 30,   suffix: '+', label: 'Countries We Serve' },
  { value: 20,   suffix: '+', label: 'Product Categories' },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = value / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setDisplay(value); clearInterval(timer); }
          else setDisplay(Math.floor(start));
        }, 25);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display.toLocaleString('en-IN')}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-20 sm:py-24 bg-gray-900 overflow-hidden relative">
      {/* subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        {/* Top label */}
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-500 text-gray-900 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 mb-6">Our Numbers</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            India's Most Trusted<br /><span className="text-yellow-400">Medical Supply Brand</span>
          </h2>
          <p className="mt-5 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Serving hospitals, clinics, and healthcare institutions since 2008 — across India and 30+ countries worldwide.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-2xl">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-900 flex flex-col items-center justify-center py-10 px-6 text-center hover:bg-gray-800 transition-colors duration-300 group">
              <p className="text-4xl sm:text-5xl font-black text-yellow-400 leading-none tabular-nums">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <div className="w-8 h-0.5 bg-yellow-500/50 group-hover:bg-yellow-500 transition-colors my-3" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
