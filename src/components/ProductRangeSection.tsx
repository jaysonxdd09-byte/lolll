const ranges = [
  { label: 'Surgical Gown',       image: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=500&q=80' },
  { label: 'Surgical Drapes',     image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80' },
  { label: 'Surgical Dressing',   image: 'https://images.unsplash.com/photo-1584982751601-97ddc0173fac?w=500&q=80' },
  { label: 'Surgical Drape Kits', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=500&q=80' },
  { label: 'Ophthalmic Blades',   image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80' },
  { label: 'Ophthalmic Cannula',  image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80' },
  { label: 'Medical Devices',     image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80' },
];

interface Props { onExplore?: () => void; }

export default function ProductRangeSection({ onExplore }: Props) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">Products Range</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
            A Leading Brand Since <span className="text-red-600">2008</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Trusted by Surgeons, Manufacturers, Exporters &amp; Suppliers of All Medical &amp; Surgical Hygiene Products In <strong>India</strong>.
          </p>
        </div>

        {/* Image strip — full width horizontal cards like reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 overflow-hidden rounded-2xl shadow-xl">
          {ranges.map((range, i) => (
            <div
              key={i}
              onClick={onExplore}
              className="group relative cursor-pointer overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={range.image}
                alt={range.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/30 transition-colors duration-400" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight">
                  {range.label}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl transition-all duration-300"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
