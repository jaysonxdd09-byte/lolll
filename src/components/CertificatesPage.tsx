import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Eye, Shield, Globe, Verified, CheckCircle, FileText } from 'lucide-react';

interface CertificatePageProps {
  onBack: () => void;
}

const certificates = [
  {
    id: 1,
    name: 'ISO 13485:2016 Quality Management',
    issuer: 'Medical Quality Standards Authority',
    date: 'Issued: Jan 2024 - Expires: Jan 2027',
    image: '/images/certificates/ISO 13485 OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/ISO 13485 OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/ISO 13485 OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    description: 'International standard for medical device quality management systems, ensuring safety and efficacy.'
  },
  {
    id: 2,
    name: 'CE Marking Certification',
    issuer: 'European Health & Safety Board',
    date: 'Issued: March 2023 - Expires: March 2026',
    image: '/images/certificates/CE MARKING OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/CE MARKING OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/CE MARKING OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    description: 'Declaration of conformity with all applicable European Union directives and regulations.'
  },
  {
    id: 3,
    name: 'FDA Registration & Compliance',
    issuer: 'U.S. Food & Drug Administration',
    date: 'Annual Registration 2026',
    image: '/images/certificates/FDA OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/FDA OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/FDA OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    description: 'Full compliance with federal regulations for the manufacture and distribution of medical devices.'
  },
  {
    id: 4,
    name: 'GMP (Good Manufacturing Practice)',
    issuer: 'International Healthcare Compliance',
    date: 'Issued: June 2024 - Expires: June 2027',
    image: '/images/certificates/GMP OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED/GMP OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED-1.png',
    pdfUrl: '/pdf of certificates/GMP OF EU TEST ONE SOLUTIONS INDIA PRIVATE LIMITED.pdf',
    description: 'System for ensuring that products are consistently produced and controlled according to quality standards.'
  },
  {
    id: 5,
    name: 'IEC (Import Export Code)',
    issuer: 'DGFT, Ministry of Commerce',
    date: 'Active Status 2026',
    image: '/images/certificates/certificateOfIEC/certificateOfIEC-1.png',
    pdfUrl: '/pdf of certificates/certificateOfIEC.pdf',
    description: 'Mandatory registration for companies engaged in the import and export of medical supplies.'
  },
  {
    id: 6,
    name: 'TEST ONE SOLUTIONS QMS',
    issuer: 'Internal Quality Management',
    date: 'Quarterly Review: Q1 2026',
    image: '/images/certificates/TEST ONE SOLUTIONS QMS/TEST ONE SOLUTIONS QMS-1.png',
    pdfUrl: '/pdf of certificates/TEST ONE SOLUTIONS QMS.pdf',
    description: 'Proprietary quality management system protocols for institutional fulfillment.'
  }
];

const CertificatesPage: React.FC<CertificatePageProps> = ({ onBack }) => {
  const handlePreview = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (pdfUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      {/* Header */}
      <div className="max-w-[95%] mx-auto px-8 mb-16">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-200 pb-12">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-4 block">Official Documentation</span>
            <h1 className="text-5xl lg:text-6xl font-serif text-gray-900 mb-6">Our <span className="text-gold-600">Certifications</span></h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed">
              Test One maintains the highest global standards for medical supply quality and institutional compliance. View and download our official documentation below.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center text-gold-500">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Verified</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-tight">Active Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[95%] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 group"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Preview */}
                <div className="md:w-1/2 relative aspect-[4/5] md:aspect-auto overflow-hidden bg-gray-100">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <button
                      onClick={() => handlePreview(cert.image)}
                      className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-gray-900 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Large
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-white transition-all duration-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif text-gray-900 mb-3 leading-tight">{cert.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 mb-4">{cert.issuer}</p>
                    <div className="text-[11px] font-medium text-gray-400 mb-6 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      {cert.date}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                      {cert.description}
                    </p>
                  </div>
                  
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button 
                      onClick={() => handleDownload(cert.pdfUrl, cert.name)}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Compliance Note */}
        <div className="mt-20 text-center max-w-3xl mx-auto bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <Globe className="w-12 h-12 text-gold-500 mx-auto mb-8" />
          <h3 className="text-2xl font-serif text-gray-900 mb-4">Global Distribution Standards</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Our distribution network adheres to WHO Good Distribution Practices (GDP) to ensure the integrity of medical supplies from our warehouse to your facility. All documents provided are notarized and updated quarterly.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Verified className="w-4 h-4 text-emerald-500" />
              Authentic Originals
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Verified className="w-4 h-4 text-emerald-500" />
              Notary Verified
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Verified className="w-4 h-4 text-emerald-500" />
              Live QR Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
