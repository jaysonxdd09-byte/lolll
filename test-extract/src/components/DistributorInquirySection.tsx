import { FormEvent, useMemo, useState } from 'react';
import { createRecord } from '../lib/contentStore';

export default function DistributorInquirySection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    city: '',
    state: '',
    message: '',
    captcha: '',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const challenge = useMemo(() => {
    const a = 2;
    const b = 6;
    return { text: `${a} + ${b}`, answer: String(a + b) };
  }, []);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.captcha.trim() !== challenge.answer) {
      setStatus('error');
      setFeedback('Captcha does not match.');
      return;
    }

    setStatus('saving');
    try {
      await createRecord('distributor_inquiries', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        city: form.city,
        state: form.state,
        message: form.message,
      });
      setStatus('done');
      setFeedback('Inquiry submitted successfully.');
      setForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        city: '',
        state: '',
        message: '',
        captcha: '',
      });
    } catch {
      setStatus('error');
      setFeedback('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <section id="inquiry" className="py-16 sm:py-24 bg-gray-50/50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Direct Info Card (Premium dark gold gradient) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-gray-900 to-gray-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500 block">Contact Us</span>
              <h3 className="text-3xl sm:text-4xl font-serif leading-tight">Send Us An <span className="text-primary-500">Inquiry</span></h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                Have questions about our medical drapes, surgical packs, or customized kits? Complete this form and our support team will reach out within 24 hours.
              </p>
            </div>
            
            <div className="space-y-6 pt-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-white">+91-9435372468</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Email</p>
                  <p className="text-sm font-medium text-white">INFOTESTONEINDIA@GMAIL.COM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <form onSubmit={onSubmit} className="lg:col-span-8 p-8 sm:p-12 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your name" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Enter your email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Enter phone number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Organization</label>
                <input value={form.organization} onChange={(e) => update('organization', e.target.value)} placeholder="Enter organization name" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Enter city" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                <input value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Enter state" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Inquiry Message</label>
                <textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell us about your requirements (e.g. products needed, bulk order size)..." rows={4} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 max-w-max">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verify Math</span>
                <span className="font-mono text-sm tracking-[0.2em] bg-white border border-gray-100 px-3 py-1 rounded-xl text-gray-700 font-bold">{challenge.text}</span>
                <input required value={form.captcha} onChange={(e) => update('captcha', e.target.value)} placeholder="Answer" className="w-18 bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-center text-sm outline-none focus:border-primary-500 font-bold" />
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" disabled={status === 'saving'} className="bg-gray-900 text-white hover:bg-primary-600 font-bold uppercase tracking-widest text-[11px] py-4 px-8 rounded-2xl shadow-xl shadow-gray-900/10 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap">
                  {status === 'saving' ? 'Submitting...' : 'Submit Inquiry'}
                </button>
                {feedback && (
                  <p className={`text-xs font-bold ${status === 'done' ? 'text-emerald-600' : 'text-red-500'}`}>{feedback}</p>
                )}
              </div>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}

