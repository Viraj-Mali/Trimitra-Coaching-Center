'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Eye, EyeOff, X, Check, Star, Users } from 'lucide-react';

interface Testimonial {
  id: string;
  authorName: string;
  authorDetail: string;
  authorType: string;
  quote: string;
  stars: number;
  isPublished: boolean;
  sortOrder: number;
}

const BLANK = { authorName: '', authorDetail: '', authorType: 'STUDENT', quote: '', stars: 5, isPublished: false, sortOrder: 0 };

export default function TestimonialsClient() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/testimonials?all=true');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openAdd = () => { setEditing(null); setForm(BLANK); setShowForm(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ authorName: t.authorName, authorDetail: t.authorDetail, authorType: t.authorType, quote: t.quote, stars: t.stars, isPublished: t.isPublished, sortOrder: t.sortOrder }); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/admin/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { toast.success(editing ? 'Updated!' : 'Created!'); setShowForm(false); fetch_(); }
      else toast.error('Failed');
    } catch { toast.error('Network error'); }
    setSaving(false);
  };

  const togglePublish = async (t: Testimonial) => {
    const res = await fetch('/api/admin/testimonials', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id, isPublished: !t.isPublished }) });
    if (res.ok) { toast.success(t.isPublished ? 'Hidden' : 'Published!'); fetch_(); }
  };

  const del = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial by "${t.authorName}"?`)) return;
    const res = await fetch('/api/admin/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id }) });
    if (res.ok) { toast.success('Deleted'); fetch_(); } else toast.error('Failed');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Testimonials</h1>
          <p className="text-slate-400">Manage student and parent testimonials shown on the website.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Author Name *</label>
                  <input required type="text" placeholder="e.g. Rahul D." value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Type</label>
                  <select value={form.authorType} onChange={e => setForm(f => ({ ...f, authorType: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm cursor-pointer">
                    <option value="STUDENT" className="bg-[#0F2E5A]">Student</option>
                    <option value="PARENT" className="bg-[#0F2E5A]">Parent</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Author Detail</label>
                  <input type="text" placeholder="e.g. JEE Mains Qualified · HSC 94% · Batch 2023" value={form.authorDetail} onChange={e => setForm(f => ({ ...f, authorDetail: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Testimonial Quote *</label>
                  <textarea required rows={4} placeholder="Write the testimonial quote..." value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Stars (1–5)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, stars: n }))} className={`text-2xl ${n <= form.stars ? 'text-brand-amber' : 'text-white/20'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${form.isPublished ? 'bg-brand-green' : 'bg-white/10'}`} onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-slate-300">Publish on website</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 text-sm disabled:opacity-50">
                  {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Check size={16} />}
                  {editing ? 'Save Changes' : 'Add Testimonial'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-white/20 text-slate-300 rounded-xl hover:bg-white/5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {loading ? <div className="glass-card p-8 text-center text-slate-400">Loading...</div>
          : items.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Users size={36} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No testimonials yet. Click &quot;Add Testimonial&quot; to create one.</p>
            </div>
          ) : items.map(t => (
            <div key={t.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="w-9 h-9 bg-brand-green/20 border border-brand-green/30 rounded-full flex items-center justify-center font-bold text-brand-green text-sm shrink-0">
                      {t.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.authorName}</p>
                      <p className="text-slate-400 text-xs">{t.authorDetail}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${t.authorType === 'PARENT' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-brand-green/15 text-brand-green border-brand-green/30'}`}>{t.authorType}</span>
                    <div className="flex gap-0.5">{[...Array(t.stars)].map((_, i) => <Star key={i} size={12} className="text-brand-amber fill-brand-amber" />)}</div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${t.isPublished ? 'bg-brand-green/15 text-brand-green border-brand-green/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                      {t.isPublished ? '● Published' : '○ Hidden'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm italic leading-relaxed">&quot;{t.quote}&quot;</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => togglePublish(t)} title={t.isPublished ? 'Hide' : 'Publish'} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">{t.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  <button onClick={() => del(t)} title="Delete" className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
