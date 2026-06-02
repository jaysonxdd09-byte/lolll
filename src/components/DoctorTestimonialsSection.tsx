import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    title: 'Senior Surgeon, AIIMS Delhi',
    spec: 'General Surgery',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
    text: 'Test One Medical supplies have been exceptional in quality. The surgical drapes and gowns meet international standards and our OT team relies on them daily. Highly recommended for any hospital procurement team.',
  },
  {
    name: 'Dr. Rajiv Menon',
    title: 'Head of Cardiology, Fortis Hospital',
    spec: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
    text: 'We have been sourcing surgical kits from Test One for over 2 years. The consistency in quality, timely delivery, and excellent after-sales support make them our preferred medical supply partner.',
  },
  {
    name: 'Dr. Anita Desai',
    title: 'Ophthalmologist, L.V. Prasad Eye Institute',
    spec: 'Ophthalmic Surgery',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80',
    text: 'The ophthalmic instruments from Test One are precision-crafted and sterile-certified. Our surgical outcomes have improved significantly since we switched to their product range.',
  },
  {
    name: 'Dr. Suresh Kumar',
    title: 'Orthopaedic Specialist, Apollo Hospitals',
    spec: 'Orthopaedics',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80',
    text: 'From wound care to surgical instruments, Test One offers a comprehensive range at competitive pricing. Their compliance documentation is always in order which simplifies our hospital audits.',
  },
  {
    name: 'Dr. Kavitha Nair',
    title: 'Gynaecologist, Manipal Hospital',
    spec: 'Gynaecology',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80',
    text: "Patient safety is our top priority. Test One's 100% bacteria-free certified products give us confidence in every procedure. The anti-fluid protection drapes are outstanding.",
  },
];

export default function DoctorTestimonialsSection() {
  const [active, setActive] = useState(0);
  const prev = () => setActive(i => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActive(i => (i === testimonials.length - 1 ? 0 : i + 1));
  const t = testimonials[active];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
            What <span className="text-red-600">Doctors</span> Say About Us
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto">
            Trusted by 500+ healthcare professionals across India's leading hospitals and clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Left sidebar — doctor list */}
          <div className="lg:col-span-2 space-y-2">
            {testimonials.map((doc, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                  i === active
                    ? 'bg-gray-900 border-gray-900 shadow-lg'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className={`w-11 h-11 rounded-full object-cover shrink-0 ${i === active ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-gray-900' : ''}`}
                />
                <div className="min-w-0">
                  <p className={`font-bold text-sm truncate ${i === active ? 'text-white' : 'text-gray-900'}`}>
                    {doc.name}
                  </p>
                  <p className={`text-xs truncate mt-0.5 ${i === active ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doc.spec}
                  </p>
                </div>
                {i === active && (
                  <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            {/* Nav arrows */}
            <div className="flex gap-2 pt-2">
              <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Right — active quote */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-8 sm:p-10 h-full"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Big quote mark */}
                <div className="text-6xl text-gray-200 font-serif leading-none mb-2 select-none">"</div>

                <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-8">
                  {t.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-red-100"
                  />
                  <div>
                    <p className="font-black text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.title}</p>
                    <span className="inline-block mt-1 bg-red-50 text-red-600 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {t.spec}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-3 gap-4 max-w-sm mx-auto">
          {[{ v: '500+', l: 'Doctors Trust Us' }, { v: '4.9★', l: 'Avg Rating' }, { v: '98%', l: 'Satisfied' }].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-black text-gray-900">{s.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
