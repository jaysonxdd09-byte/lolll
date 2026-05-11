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
    <section id="distributor-inquiry" className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-5">Distributor Inquiry</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="hidden lg:block">
              <img
                src="https://img.freepik.com/free-vector/business-partnership-concept-illustration_114360-8843.jpg?w=1200"
                alt="Distributor inquiry"
                className="w-full h-auto object-contain max-h-[340px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter Name" className="col-span-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
              <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Enter Email" className="col-span-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
              <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Enter Phone No" className="col-span-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
              <input value={form.organization} onChange={(e) => update('organization', e.target.value)} placeholder="Organization" className="col-span-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
              <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Enter City" className="col-span-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
              <input value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Enter State" className="col-span-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
              <textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Enter Message" className="sm:col-span-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm min-h-[120px] outline-none focus:border-gold-500" />
              <div className="flex items-center gap-3 sm:col-span-2">
                <span className="font-mono text-sm tracking-[0.35em]">{challenge.text}</span>
                <input value={form.captcha} onChange={(e) => update('captcha', e.target.value)} placeholder="Answer" className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold-500" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={status === 'saving'} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                  {status === 'saving' ? 'Submitting...' : 'Submit'}
                </button>
                {feedback && (
                  <p className={`text-xs ${status === 'done' ? 'text-emerald-600' : 'text-red-500'}`}>{feedback}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
