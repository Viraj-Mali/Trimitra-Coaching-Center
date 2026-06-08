'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
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
      if (res.ok && data.role === 'ADMIN') {
        toast.success('Welcome, Administrator!');
        router.push('/admin/dashboard');
      } else if (res.ok) {
        toast.error('This account does not have admin privileges.');
      } else {
        toast.error(data.error || 'Login failed.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-amber/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <Image src="/logo.png" alt="Trimitra Coaching Centre" width={80} height={80} className="object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-slate-400 text-sm">Trimitra Coaching Centre — Administration</p>
        </div>

        <div className="glass-card border border-brand-amber/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Admin Mobile</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="adminMobile"
                  type="tel"
                  placeholder="Admin mobile number"
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="adminPassword"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Admin password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              id="adminLoginSubmit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base disabled:opacity-70"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🔐 Access Admin Panel'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-500 text-xs mt-4">
          <Link href="/en" className="hover:text-slate-300">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}
