'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, User, Phone, BookOpen, MessageSquare } from 'lucide-react';
import { Dictionary } from '@/dictionaries/types';
import { TRACK_LABELS } from '@/lib/utils';

interface LeadCaptureFormProps {
  dict: Dictionary['lead_form'];
  compact?: boolean;
}

const STANDARDS = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const TRACKS = Object.entries(TRACK_LABELS);

export default function LeadCaptureForm({ dict, compact = false }: LeadCaptureFormProps) {
  const [form, setForm] = useState({
    studentName: '', parentName: '', mobile: '', standard: '', track: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.parentName || !form.mobile || !form.standard || !form.track) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(dict.success);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
        <p className="text-slate-400">{dict.success}</p>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'glass-card p-8'}>
      {!compact && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{dict.title}</h3>
          <p className="text-slate-400 text-sm">{dict.subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="studentName"
              type="text"
              placeholder={dict.student_name + ' *'}
              value={form.studentName}
              onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="parentName"
              type="text"
              placeholder={dict.parent_name + ' *'}
              value={form.parentName}
              onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))}
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="mobile"
            type="tel"
            placeholder={dict.mobile + ' *'}
            value={form.mobile}
            onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
            className="input-field pl-10"
            maxLength={10}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            id="standard"
            value={form.standard}
            onChange={e => setForm(f => ({ ...f, standard: e.target.value }))}
            className="select-field"
            required
          >
            <option value="">{dict.select_standard}</option>
            {STANDARDS.map(s => (
              <option key={s} value={s}>{s} Standard</option>
            ))}
          </select>
          <select
            id="track"
            value={form.track}
            onChange={e => setForm(f => ({ ...f, track: e.target.value }))}
            className="select-field"
            required
          >
            <option value="">{dict.select_track}</option>
            {TRACKS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MessageSquare size={16} className="absolute left-3 top-3.5 text-slate-400" />
          <textarea
            id="notes"
            placeholder={dict.notes}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="input-field pl-10 resize-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          id="submitDemoForm"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {dict.submitting}
            </>
          ) : (
            <>
              <Send size={16} />
              {dict.submit}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
