'use client';

import { useState } from 'react';
import { User, Users, Phone, BookOpen, Clock, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const STANDARDS = ['6th', '7th', '8th', '9th', '10th', '11th', '12th', 'Dropper'];
const TRACKS = [
  { value: 'FOUNDATION_6_9', label: 'Foundation (6th–8th)' },
  { value: 'BOARD_10', label: '9th-10th Board Mastery' },
  { value: 'SCIENCE_11_12', label: '11th–12th Science' },
  { value: 'COMPETITIVE', label: 'JEE & NEET' },
  { value: 'COMPETITIVE_MHTCET', label: 'MHT-CET (PCMB Group)' },
  { value: 'COMPETITIVE_NATA', label: 'NATA' },
];
const TIME_SLOTS = [
  'Morning (7:00 AM – 9:00 AM)',
  'Late Morning (10:00 AM – 12:00 PM)',
  'Afternoon (2:00 PM – 4:00 PM)',
  'Evening (5:00 PM – 7:00 PM)',
  'Any time works',
];

interface DemoFormClientProps {
  lang?: string;
}

export default function DemoFormClient({ lang = 'en' }: DemoFormClientProps) {
  const [form, setForm] = useState({
    studentName: '', parentName: '', mobile: '',
    standard: '', track: '', preferredTime: '', notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    if (form.studentName.trim().length < 3) {
      setErrorMsg(lang === 'mr' ? 'विद्यार्थ्याचे नाव किमान ३ अक्षरांचे असावे.' : 'Student name must be at least 3 characters.');
      setStatus('error');
      return;
    }

    if (form.parentName.trim().length < 3) {
      setErrorMsg(lang === 'mr' ? 'पालकाचे नाव किमान ३ अक्षरांचे असावे.' : 'Parent name must be at least 3 characters.');
      setStatus('error');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setErrorMsg(lang === 'mr' ? 'कृपया वैध भारतीय मोबाइल नंबर टाका.' : 'Please enter a valid 10-digit Indian mobile number.');
      setStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({ studentName: '', parentName: '', mobile: '', standard: '', track: '', preferredTime: '', notes: '' });
      } else {
        setErrorMsg(data.error || (lang === 'mr' ? 'काहीतरी चुकले. पुन्हा प्रयत्न करा.' : 'Something went wrong. Please try again.'));
        setStatus('error');
      }
    } catch {
      setErrorMsg(lang === 'mr' ? 'नेटवर्क त्रुटी. पुन्हा प्रयत्न करा.' : 'Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white/3 border border-brand-green/30 rounded-2xl p-10 text-center">
        <div className="w-20 h-20 bg-brand-green/20 border border-brand-green/40 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={36} className="text-brand-green" />
        </div>
        <h3 className="text-white text-2xl font-bold mb-2">
          {lang === 'mr' ? 'धन्यवाद!' : 'Thank You!'}
        </h3>
        <p className="text-slate-300 mb-4">
          {lang === 'mr'
            ? 'तुमची प्रवेश नोंदणी यशस्वी झाली. आम्ही २४ तासांत तुम्हाला संपर्क करू.'
            : 'Your enrollment inquiry has been received. We will contact you within 24 hours to guide you next.'}
        </p>
        <p className="text-slate-400 text-sm">
          {lang === 'mr'
            ? 'त्वरित संपर्कासाठी WhatsApp वर आम्हाला संदेश पाठवा.'
            : 'For immediate assistance, WhatsApp us at +91 99990 00000'}
        </p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-brand-green text-sm hover:underline">
          {lang === 'mr' ? 'दुसरी चौकशी करा' : 'Submit Another Enquiry'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-6 lg:p-7">
      <h3 className="text-white font-bold text-xl mb-1">
        {lang === 'mr' ? 'प्रवेशासाठी नोंदणी करा' : 'Register / Enroll Now'}
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        {lang === 'mr'
          ? 'खाली तपशील भरा. आम्ही २४ तासांत तुमच्याशी संपर्क साधू.'
          : 'Fill in the details below to secure your seat. We will contact you within 24 hours.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {lang === 'mr' ? 'विद्यार्थ्याचे नाव *' : "Student's Full Name *"}
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" required placeholder={lang === 'mr' ? 'विद्यार्थ्याचे नाव' : "Student's name"} value={form.studentName} onChange={set('studentName')}
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green focus:bg-white/8 transition-all text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {lang === 'mr' ? 'पालकाचे नाव *' : "Parent's Name *"}
            </label>
            <div className="relative">
              <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" required placeholder={lang === 'mr' ? 'पालकाचे नाव' : "Parent's name"} value={form.parentName} onChange={set('parentName')}
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green focus:bg-white/8 transition-all text-sm" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            {lang === 'mr' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="tel" required placeholder={lang === 'mr' ? '१०-अंकी मोबाइल नंबर' : '10-digit mobile number'} value={form.mobile} onChange={set('mobile')} maxLength={10}
              className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green focus:bg-white/8 transition-all text-sm" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {lang === 'mr' ? 'सध्याचा वर्ग *' : 'Current Standard *'}
            </label>
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <select required value={form.standard} onChange={set('standard')}
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green transition-all text-sm appearance-none cursor-pointer">
                <option value="" className="bg-[#0F2E5A]">{lang === 'mr' ? 'वर्ग निवडा' : 'Select Standard'}</option>
                {STANDARDS.map(s => <option key={s} value={s} className="bg-[#0F2E5A]">{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {lang === 'mr' ? 'लक्ष्य अभ्यासक्रम *' : 'Target Course *'}
            </label>
            <select required value={form.track} onChange={set('track')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green transition-all text-sm appearance-none cursor-pointer">
              <option value="" className="bg-[#0F2E5A]">{lang === 'mr' ? 'अभ्यासक्रम निवडा' : 'Select Course'}</option>
              {TRACKS.map(t => <option key={t.value} value={t.value} className="bg-[#0F2E5A]">{t.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            {lang === 'mr' ? 'पसंतीची वेळ *' : 'Preferred Batch Time *'}
          </label>
          <div className="relative">
            <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <select required value={form.preferredTime} onChange={set('preferredTime')}
              className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green transition-all text-sm appearance-none cursor-pointer">
              <option value="" className="bg-[#0F2E5A]">{lang === 'mr' ? 'वेळ निवडा' : 'Select preferred batch timing'}</option>
              {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-[#0F2E5A]">{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            {lang === 'mr' ? 'काही विशिष्ट प्रश्न? (पर्यायी)' : 'Any Specific Questions? (Optional)'}
          </label>
          <div className="relative">
            <MessageSquare size={15} className="absolute left-3 top-3.5 text-slate-500" />
            <textarea rows={3} placeholder={lang === 'mr' ? 'तुमचे प्रश्न किंवा अपेक्षा लिहा...' : 'Write your questions, weak areas, or expectations...'}
              value={form.notes} onChange={set('notes')}
              className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green focus:bg-white/8 transition-all text-sm resize-none" />
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <button type="submit" disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-brand-amber hover:bg-amber-500 disabled:opacity-70 text-white font-bold rounded-xl transition-all text-base shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] disabled:scale-100">
          {status === 'loading' ? (
            <><Loader2 size={18} className="animate-spin" /> {lang === 'mr' ? 'सादर होत आहे...' : 'Submitting...'}</>
          ) : (
            lang === 'mr' ? '📝 आताच प्रवेश नोंदणी करा' : '📝 Enroll Now'
          )}
        </button>

        <p className="text-center text-slate-500 text-xs">
          {lang === 'mr'
            ? 'तुमची माहिती पूर्णपणे सुरक्षित आहे. कोणत्याही तृतीय पक्षाशी शेअर केली जाणार नाही.'
            : 'Your information is completely secure and will never be shared with third parties.'}
        </p>
      </form>
    </div>
  );
}
