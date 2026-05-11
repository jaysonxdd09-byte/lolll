export default function PresenceSection() {
  return (
    <section id="presence" className="py-14 sm:py-20 bg-white">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl sm:text-4xl font-serif text-gray-900 mb-6">Our Presence <span className="text-emerald-600">#AllOverIndia</span></h3>
              <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Test One has built a strong national distribution network, delivering quality medical supplies from
                metro hubs to remote care centers. With trusted healthcare partners across states, we ensure timely
                fulfillment, compliance-ready inventory, and reliable post-sales support for hospitals, clinics, and
                institutions.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/map/Gemini_Generated_Image_8bi78y8bi78y8bi7-removebg-preview.png"
                alt="India coverage map"
                className="w-full h-auto object-contain max-h-[500px] sm:max-h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
