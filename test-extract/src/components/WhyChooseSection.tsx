const features = [
  { label: 'Premium Quality',       desc: 'ISO-certified manufacturing with rigorous QC at every stage' },
  { label: 'Anti-fluid Protection', desc: 'Multi-layer barriers tested against fluid penetration' },
  { label: 'Well & Safe Stitch',    desc: 'Precision stitching that holds under extended procedure durations' },
  { label: 'Adjustable Wear',       desc: 'Ergonomic fits designed for all surgical team sizes' },
  { label: '100% Bacteria Free',    desc: 'Sterile-certified packaging with traceable batch control' },
  { label: 'Fast OT Setup',         desc: 'Pre-assembled kits that cut preparation time by up to 40%' },
];

export default function WhyChooseSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">Why Choose Test One</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
            We Make Customised Range<br className="hidden sm:block" /> For All Medical Categories
          </h2>
          <p className="mt-5 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Renowned manufacturer of high-quality disposable surgical drapes, gowns, and surgery packs — providing the finest protective solutions to healthcare professionals.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — image with floating badges */}
          <div className="relative flex items-center justify-center min-h-[420px]">
            {/* Background circle */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gray-100 opacity-60" />
            <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-gray-200" />

            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80"
              alt="Surgical Gown"
              className="relative z-10 h-72 sm:h-96 w-auto object-contain drop-shadow-2xl"
            />

            {/* Floating tags */}
            {[
              { label: 'Premium Quality',    pos: 'top-4 right-4 sm:right-8' },
              { label: 'Anti-fluid Guard',   pos: 'top-1/3 left-0 sm:left-4' },
              { label: '100% Bacteria Free', pos: 'bottom-16 right-2 sm:right-6' },
              { label: 'Adjustable Fit',     pos: 'bottom-4 left-4 sm:left-10' },
            ].map((tag) => (
              <div key={tag.label} className={`absolute z-20 ${tag.pos} bg-white border border-gray-200 shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{tag.label}</span>
              </div>
            ))}
          </div>

          {/* Right — features + CTA */}
          <div>
            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{f.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certification badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['ISO 13485', 'CE Certified', 'WHO-GMP', 'CDSCO Approved'].map((b) => (
                <span key={b} className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  ✓ {b}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-[10px] px-7 py-4 rounded-xl transition-all shadow-lg shadow-red-500/20">
                Own Mfg. Unit
              </button>
              <button className="bg-gray-900 hover:bg-gray-700 text-white font-bold uppercase tracking-widest text-[10px] px-7 py-4 rounded-xl transition-all">
                ▶ Corporate Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
