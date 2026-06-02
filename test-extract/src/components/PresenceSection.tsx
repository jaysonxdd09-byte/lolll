export default function PresenceSection() {
  return (
    <section id="presence" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-yellow-600">Our Presence</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
            #AllOverIndia &amp; <span className="text-yellow-600">All Over World</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            We successfully export to more than <strong>30+ countries</strong>, delivering precision medical supplies to healthcare professionals worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {/* Left — stats + checklist */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: '30+',  l: 'Countries',    c: 'bg-yellow-500'  },
                { v: '500+', l: 'Hospitals',    c: 'bg-gray-900' },
                { v: '18',   l: 'City Offices', c: 'bg-gray-900' },
                { v: '7K+',  l: 'Clients',      c: 'bg-yellow-500'  },
              ].map((s) => (
                <div key={s.l} className={`${s.c} rounded-2xl p-6 text-center text-white`}>
                  <p className="text-3xl font-black leading-none">{s.v}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-2 opacity-80">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              {[
                'Pan-India distribution network',
                'Export to 30+ countries worldwide',
                'Compliance-ready supply chain',
                'Trusted by 500+ hospitals',
                '24/7 customer & order support',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — actual world map image */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-4 sm:p-6">
            <img
              src="/images/world-map.png"
              alt="Global Presence Map"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

