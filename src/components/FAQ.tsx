import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, MessageCircle, Truck, ShieldCheck, CreditCard } from 'lucide-react';

const faqData = [
  {
    question: "What is your standard delivery time?",
    answer: "For institutional orders within the region, we typically deliver within 2-4 business days. International shipping varies by location but generally takes 7-14 business days. All shipments are trackable and handled with medical-grade logistics protocols.",
    icon: <Truck className="w-5 h-5" />
  },
  {
    question: "Are your products certified for clinical use?",
    answer: "Yes, all products in the Test One catalog meet or exceed international medical standards, including ISO 13485, CE marking, and FDA compliance where applicable. Certificates of Analysis (CoA) can be provided upon request for every batch.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    question: "How do I place a bulk order for a hospital?",
    answer: "For large-scale institutional procurement, please use our WhatsApp Bulk Inquiry button on the product page or contact our corporate sales team directly. We offer tiered pricing and dedicated account management for healthcare facilities.",
    icon: <MessageCircle className="w-5 h-5" />
  },
  {
    question: "What is your return policy for medical supplies?",
    answer: "Unopened, sterile products in their original packaging can be returned within 30 days. Due to safety regulations, we cannot accept returns on items where the sterile seal has been broken or tampered with.",
    icon: <HelpCircle className="w-5 h-5" />
  },
  {
    question: "Do you offer credit terms for established clinics?",
    answer: "Yes, we offer Net-30 and Net-60 credit terms for registered hospitals and clinics following a standard credit verification process. Please contact our finance department to set up an institutional account.",
    icon: <CreditCard className="w-5 h-5" />
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-4 block">Knowledge Base</span>
          <h2 className="text-4xl font-serif text-gray-900 mb-6">Frequently Asked <span className="text-gold-600">Questions</span></h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Everything you need to know about our medical solutions, procurement process, and global standards.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="group">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full flex items-center gap-4 p-6 rounded-2xl border transition-all duration-300 text-left ${
                  openIndex === index 
                    ? 'bg-gold-50/50 border-gold-200 shadow-sm' 
                    : 'bg-white border-gray-100 hover:border-gold-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  openIndex === index ? 'bg-gold-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-gold-500'
                }`}>
                  {item.icon}
                </div>
                <span className="flex-1 text-sm sm:text-base font-bold text-gray-900">{item.question}</span>
                <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  {openIndex === index ? <Minus className="w-5 h-5 text-gold-600" /> : <Plus className="w-5 h-5 text-gray-300" />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-20 py-6 text-sm text-gray-500 leading-relaxed font-light">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-gray-900 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <h4 className="text-xl font-serif text-white mb-2">Still have questions?</h4>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">Our medical specialists are here to assist you 24/7</p>
            <button className="bg-gold-500 text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20">
              Contact Support Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
