import React from 'react';

const categories = [
  { icon: '🏥', label: 'General Surgery', active: false },
  { icon: '🦴', label: 'Orthopedics', active: false },
  { icon: '❤️', label: 'Cardiac OT', active: true },
  { icon: '🦷', label: 'Dental Surgery', active: false },
  { icon: '👁️', label: 'Eye Care', active: false },
  { icon: '🤱', label: 'Women Care', active: false },
  { icon: '🧠', label: 'Neuro Care', active: false },
  { icon: '💧', label: 'Urology', active: false },
  { icon: '🫀', label: 'Critical Care', active: false },
  { icon: '👂', label: 'ENT Surgery', active: false },
];

const svgIcons: Record<string, React.ReactElement> = {
  'Surgeon Care': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="14" r="7" /><path d="M10 38c0-8 4-12 14-12s14 4 14 12" />
      <path d="M28 24l6 6m0 0l4-4m-4 4l-4 4" />
    </svg>
  ),
  'Ortho Care': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8c0 4 2 6 6 6s6-2 6-6" /><path d="M24 14v8m0 0l-6 10m6-10l6 10" />
      <path d="M18 32l-4 8m16-8l4 8" />
    </svg>
  ),
  'Cardiology': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 38s-14-10-14-20a10 10 0 0120 0 10 10 0 0120 0c0 10-14 20-14 20" strokeLinejoin="round" />
      <path d="M16 24h4l3-6 4 12 3-6h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Dentists': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8c-4 0-8 4-8 10 0 12 8 22 16 22s16-10 16-22C40 12 36 8 32 8c-3 0-5 2-8 2s-5-2-8-2z" />
    </svg>
  ),
  'Ophthalmic': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 24s6-12 18-12 18 12 18 12-6 12-18 12S6 24 6 24z" />
      <circle cx="24" cy="24" r="5" />
    </svg>
  ),
  'Gynaec Care': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="18" r="10" /><path d="M24 28v8m0 0l-6 4m6-4l6 4" />
      <path d="M18 14c0-3 3-5 6-5s6 2 6 5" />
    </svg>
  ),
  'Neurology': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 8c-8 0-14 6-14 14 0 5 3 9 7 11v7h14v-7c4-2 7-6 7-11 0-8-6-14-14-14z" />
      <path d="M18 22c0-3 3-5 6-5m-2 10c1.5 0 3-.5 4-1.5" />
    </svg>
  ),
  'Uro Care': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="20" cy="20" rx="8" ry="10" /><ellipse cx="28" cy="20" rx="8" ry="10" />
      <path d="M24 30v10" /><path d="M20 40h8" />
    </svg>
  ),
  'Transplant Care': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="8" /><circle cx="30" cy="30" r="8" />
      <path d="M24 12l12 12m-12 0l12-12" />
    </svg>
  ),
  'ENT Care': (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 10c-6 0-10 5-10 12 0 4 2 8 5 10l2 10h14l2-10c3-2 5-6 5-10 0-7-4-12-10-12h-8z" />
      <path d="M18 22c0-3 2-5 6-5" />
    </svg>
  ),
};

export default function MedicalCategoriesSection() {
  return (
    <section className="py-24 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-center">
          <div className="xl:col-span-7">
            <p className="text-amber-600 text-[11px] font-bold uppercase tracking-[0.28em]">TEST ONE SPECIALTIES</p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Built For Every Surgical Discipline
            </h2>
            <p className="mt-5 text-slate-600 text-base sm:text-lg max-w-3xl">
              From routine procedures to complex interventions, Test One supports hospitals with practical, sterile, and procedure-ready disposable systems.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.label}
                  className={`rounded-2xl border p-5 text-center transition-all duration-300 ${
                    cat.active
                      ? 'bg-amber-500 border-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.35)]'
                      : 'bg-white border-amber-200 text-slate-700 hover:border-amber-400 hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`mx-auto w-fit ${cat.active ? 'text-white' : 'text-amber-500'}`}>
                    {svgIcons[cat.label] || svgIcons['Surgeon Care']}
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider leading-tight">
                    {cat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-amber-100 to-white border border-amber-200 min-h-[560px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,158,11,0.25),transparent_50%)]" />
              <img
                src="/images/surgeon_standing.png"
                alt="Surgeon"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[560px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
