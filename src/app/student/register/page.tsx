'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Phone, Lock, Eye, EyeOff, BookOpen, ArrowRight } from 'lucide-react';
import { TRACK_LABELS } from '@/lib/utils';

const STANDARDS = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

export default function StudentRegisterPage() {
  const [form, setForm] = useState({
    name: '', mobile: '', password: '', confirmPassword: '', track: '', standard: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Account created! Your Roll No: ${data.rollNumber}`);
        router.push('/student/dashboard');
      } else {
        toast.error(data.error || 'Registration failed.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-brand-amber/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/en" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-green flex items-center justify-center shadow-green">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <div className="text-left">
              <span className="text-white font-bold text-lg block">Trimitra</span>
              <span className="text-brand-green text-xs">Coaching Centre</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Free Account</h1>
          <p className="text-slate-400 text-sm">Start learning with free study tools and daily quizzes.</p>
        </div>

        {/* Free perks */}
        <div className="glass-card border border-brand-green/20 p-4 mb-6">
          <p className="text-brand-green text-xs font-semibold mb-2">✨ Free account includes:</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
            {['Syllabus Trackers', 'Daily 10-Q Quiz', 'Streak & XP System', 'Free Study Notes'].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <span className="text-brand-green">✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card border border-white/20 p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="regName"
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field pl-10"
                required
              />
            </div>

            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="regMobile"
                type="tel"
                placeholder="Mobile Number *"
                value={form.mobile}
                onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                className="input-field pl-10"
                maxLength={10}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                id="regStandard"
                value={form.standard}
                onChange={e => setForm(f => ({ ...f, standard: e.target.value }))}
                className="select-field"
                required
              >
                <option value="">Class Standard *</option>
                {STANDARDS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                id="regTrack"
                value={form.track}
                onChange={e => setForm(f => ({ ...f, track: e.target.value }))}
                className="select-field"
                required
              >
                <option value="">Target Course *</option>
                {Object.entries(TRACK_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="regPassword"
                type={showPwd ? 'text' : 'password'}
                placeholder="Create Password (min 6 chars) *"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pl-10 pr-10"
                minLength={6}
                required
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="regConfirmPassword"
                type={showPwd ? 'text' : 'password'}
                placeholder="Confirm Password *"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="input-field pl-10"
                required
              />
            </div>

            <button
              id="registerSubmit"
              type="submit"
              disabled={loading}
              className="btn-secondary w-full justify-center text-base disabled:opacity-70"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Free Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/10 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link href="/student/login" className="text-brand-green font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          <Link href="/en" className="hover:text-slate-300">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
