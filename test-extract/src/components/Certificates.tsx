import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle, FileText, Shield, Globe, Verified } from 'lucide-react';

const certificates = [
  {
    id: 1,
    name: 'ISO 13485:2016',
    issuer: 'Medical Quality Standards',
    description: 'International standard for medical device quality management systems.',
    image: '/images/certificates/ISO 13485 OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/ISO 13485 OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/ISO 13485 OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    icon: <Shield className="w-8 h-8 text-primary-500" />,
    color: 'bg-blue-50'
  },
  {
    id: 2,
    name: 'CE Marking',
    issuer: 'European Health Safety',
    description: 'Compliance with European Union health, safety, and environmental protection standards.',
    image: '/images/certificates/CE MARKING OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/CE MARKING OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/CE MARKING OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    icon: <Globe className="w-8 h-8 text-primary-500" />,
    color: 'bg-indigo-50'
  },
  {
    id: 3,
    name: 'FDA Registered',
    issuer: 'U.S. Food & Drug Administration',
    description: 'Compliance with federal regulations for medical devices and equipment.',
    image: '/images/certificates/FDA OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/FDA OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/FDA OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    icon: <Verified className="w-8 h-8 text-primary-500" />,
    color: 'bg-emerald-50'
  },
  {
    id: 4,
    name: 'GMP Certified',
    issuer: 'Good Manufacturing Practices',
    description: 'Ensuring products are consistently produced and controlled according to quality standards.',
    image: '/images/certificates/GMP OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/GMP OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/GMP OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    icon: <CheckCircle className="w-8 h-8 text-primary-500" />,
    color: 'bg-amber-50'
  }
];

interface CertificatesProps {
  onViewDocuments?: () => void;
}

const Certificates: React.FC<CertificatesProps> = ({ onViewDocuments }) => {
  return (
    <section id="certificates" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[95%] mx-auto px-8 relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-4 block">Compliance & Quality</span>
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-6 leading-tight">
            Industry-Leading <span className="text-primary-600">Certifications</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
            Our commitment to excellence is verified by international standards and rigorous quality assurance protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* Image Thumbnail */}
              <div className="h-48 bg-gray-50 relative overflow-hidden group-hover:h-52 transition-all duration-500">
                <img 
                  src={cert.image} 
                  alt={cert.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                <div className={`absolute top-4 right-4 w-12 h-12 ${cert.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  {cert.icon}
                </div>
              </div>

              <div className="p-8 flex flex-col items-center text-center -mt-4 relative z-10">
                <h3 className="text-xl font-serif text-gray-900 mb-3">{cert.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-4">{cert.issuer}</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                {cert.description}
              </p>
                <button
                  onClick={onViewDocuments}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary-500 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View Document
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certificates;

