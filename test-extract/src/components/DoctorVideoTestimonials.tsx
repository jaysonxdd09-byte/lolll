import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface VideoTestimonial {
  id: string;
  name: string;
  title: string;
  hospital: string;
  specialty: string;
  avatar: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  rating: number;
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Senior Cardiologist',
    hospital: 'AIIMS Delhi',
    specialty: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    duration: '0:45',
    rating: 5
  },
  {
    id: '2',
    name: 'Dr. Rajiv Menon',
    title: 'Head of Surgery',
    hospital: 'Fortis Hospital',
    specialty: 'General Surgery',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80',
    duration: '1:12',
    rating: 5
  },
  {
    id: '3',
    name: 'Dr. Anita Desai',
    title: 'Ophthalmologist',
    hospital: 'L.V. Prasad Eye Institute',
    specialty: 'Ophthalmology',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    duration: '0:38',
    rating: 5
  },
  {
    id: '4',
    name: 'Dr. Suresh Kumar',
    title: 'Orthopedic Surgeon',
    hospital: 'Apollo Hospitals',
    specialty: 'Orthopedics',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
    duration: '0:52',
    rating: 5
  },
  {
    id: '5',
    name: 'Dr. Kavitha Nair',
    title: 'Gynaecologist',
    hospital: 'Manipal Hospital',
    specialty: 'Gynaecology',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80',
    duration: '1:05',
    rating: 5
  },
  {
    id: '6',
    name: 'Dr. Arun Patel',
    title: 'Neurosurgeon',
    hospital: 'Max Healthcare',
    specialty: 'Neurosurgery',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    duration: '0:48',
    rating: 5
  }
];

export default function DoctorVideoTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeTestimonial = videoTestimonials[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? videoTestimonials.length - 1 : prev - 1));
    setShowVideo(false);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === videoTestimonials.length - 1 ? 0 : prev + 1));
    setShowVideo(false);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-yellow-500">Video Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-blue-900 leading-tight">
            Doctors Share Their <span className="text-yellow-500">Experience</span>
          </h2>
          <p className="mt-4 text-blue-500 text-base max-w-xl mx-auto">
            Watch leading healthcare professionals talk about their experience with Test One Medical supplies.
          </p>
        </div>

        {/* Main Video Player */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {showVideo ? (
                    <video
                      ref={videoRef}
                      src={activeTestimonial.videoUrl}
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      autoPlay
                      playsInline
                      onEnded={() => setIsPlaying(false)}
                    />
                  ) : (
                    <img
                      src={activeTestimonial.thumbnail}
                      alt={activeTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Play Button Overlay */}
              {!showVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    onClick={() => { setShowVideo(true); setIsPlaying(true); }}
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-xl"
                  >
                    <Play className="w-8 h-8 text-yellow-500 ml-1" fill="currentColor" />
                  </button>
                </div>
              )}

              {/* Video Controls */}
              {showVideo && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlay}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <span className="text-white text-sm font-medium">{activeTestimonial.duration}</span>
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 text-blue-900" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6 text-blue-900" />
              </button>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-2xl p-6 h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-yellow-200 shadow-lg"
                  />
                  <div>
                    <h3 className="font-black text-blue-900 text-lg">{activeTestimonial.name}</h3>
                    <p className="text-yellow-500 font-bold text-sm">{activeTestimonial.title}</p>
                    <p className="text-blue-500 text-sm">{activeTestimonial.hospital}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-bold text-blue-600">{activeTestimonial.rating}.0</span>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4">
                  <p className="text-blue-600 text-sm leading-relaxed italic">
                    "Test One Medical supplies have consistently delivered exceptional quality products. Their surgical drapes and gowns meet international standards."
                  </p>
                </div>

                <span className="inline-block bg-yellow-50 text-yellow-500 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {activeTestimonial.specialty}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {videoTestimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => {
                setActiveIndex(index);
                setShowVideo(false);
                setIsPlaying(false);
              }}
              className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                index === activeIndex
                  ? 'ring-4 ring-yellow-500 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={testimonial.thumbnail}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-bold truncate">{testimonial.name}</p>
                <p className="text-white/70 text-[10px] truncate">{testimonial.duration}</p>
              </div>
              {index === activeIndex && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { v: '50+', l: 'Video Testimonials' },
            { v: '500+', l: 'Doctors Trust Us' },
            { v: '4.9★', l: 'Average Rating' },
            { v: '30+', l: 'Countries Served' }
          ].map((s) => (
            <div key={s.l} className="text-center bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-black text-blue-900">{s.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
