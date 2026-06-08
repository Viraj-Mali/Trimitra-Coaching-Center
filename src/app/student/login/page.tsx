'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function StudentLoginPage() {
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.name}!`);
        if (data.role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/student/dashboard');
      } else {
        toast.error(data.error || 'Login failed.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-brand-amber/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/en" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-green flex items-center justify-center shadow-green">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <div className="text-left">
              <span className="text-white font-bold text-lg block">Trimitra</span>
              <span className="text-brand-green text-xs">Coaching Centre</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Student Login</h1>
          <p className="text-slate-400 text-sm">Access your dashboard, materials, and mock tests.</p>
        </div>

        {/* Form */}
        <div className="glass-card border border-white/20 p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Mobile Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="loginMobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                  className="input-field pl-10"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="loginPassword"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="loginSubmit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base disabled:opacity-70"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Login <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/student/register" className="text-brand-green font-semibold hover:underline">
                Sign Up Free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          <Link href="/en" className="hover:text-slate-300 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
