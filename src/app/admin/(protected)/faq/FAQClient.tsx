'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Eye, EyeOff, X, Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  course?: { id: string; title: string };
}

const BLANK = {
  question: '',
  answer: '',
  sortOrder: 0,
  isActive: true,
};

export default function FAQClient() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/faq?all=true');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openAdd = () => {
    setEditing(null);
    setForm(BLANK);
    setShowForm(true);
  };

  const openEdit = (f: FAQ) => {
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
      isActive: f.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/admin/faq', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editing ? 'Updated!' : 'Created!');
        setShowForm(false);
        fetch_();
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Network error');
    }
    setSaving(false);
  };

  const toggleActive = async (faq: FAQ) => {
    const res = await fetch('/api/admin/faq', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: faq.id, isActive: !faq.isActive }),
    });
    if (res.ok) {
      toast.success(faq.isActive ? 'Hidden' : 'Activated!');
      fetch_();
    }
  };

  const del = async (faq: FAQ) => {
    if (!confirm(`Delete FAQ: "${faq.question}"?`)) return;
    const res = await fetch('/api/admin/faq', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: faq.id }),
    });
    if (res.ok) {
      toast.success('Deleted');
      fetch_();
    } else {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">FAQ Management</h1>
          <p className="text-slate-400">Manage frequently asked questions shown on the website.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit' : 'Add'} FAQ</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Question *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. What is the fee structure for JEE coaching?"
                  value={form.question}
                  onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Answer *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the detailed answer here..."
                  value={form.answer}
                  onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-brand-green' : 'bg-white/10'}`}
                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-slate-300">Active (visible on website)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 text-sm disabled:opacity-50"
                >
                  {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Check size={16} />}
                  {editing ? 'Save Changes' : 'Add FAQ'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-white/20 text-slate-300 rounded-xl hover:bg-white/5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="grid gap-3">
        {loading ? (
          <div className="glass-card p-8 text-center text-slate-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <HelpCircle size={36} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No FAQs yet. Click &quot;Add FAQ&quot; to create one.</p>
          </div>
        ) : items.map(faq => (
          <div key={faq.id} className="glass-card overflow-hidden">
            {/* Accordion Header */}
            <div
              className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-semibold text-sm">{faq.question}</p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold shrink-0 ${faq.isActive ? 'bg-brand-green/15 text-brand-green border-brand-green/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                    {faq.isActive ? '● Active' : '○ Hidden'}
                  </span>
                  {faq.course && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400 border border-white/10 shrink-0">
                      {faq.course.title}
                    </span>
                  )}
                </div>
                {expanded !== faq.id && (
                  <p className="text-slate-400 text-xs line-clamp-1">{faq.answer}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <button
                  onClick={e => { e.stopPropagation(); openEdit(faq); }}
                  title="Edit"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); toggleActive(faq); }}
                  title={faq.isActive ? 'Hide' : 'Activate'}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  {faq.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); del(faq); }}
                  title="Delete"
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
                {expanded === faq.id ? <ChevronUp size={14} className="text-slate-400 ml-1" /> : <ChevronDown size={14} className="text-slate-400 ml-1" />}
              </div>
            </div>
            {/* Expanded Answer */}
            {expanded === faq.id && (
              <div className="px-4 pb-4 pt-0 border-t border-white/10">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
