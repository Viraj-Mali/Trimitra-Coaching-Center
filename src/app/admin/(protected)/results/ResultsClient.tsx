'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Eye, EyeOff, X, Check, Trophy } from 'lucide-react';
import { TRACK_LABELS } from '@/lib/utils';

interface Result {
  id: string;
  studentName: string;
  examName: string;
  score: string;
  track: string;
  examYear: number;
  isPublished: boolean;
  sortOrder: number;
}

const BLANK = {
  studentName: '',
  examName: '',
  score: '',
  track: 'COMPETITIVE',
  examYear: 2024,
  isPublished: false,
  sortOrder: 0,
};

export default function ResultsClient() {
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/results?all=true');
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

  const openEdit = (r: Result) => {
    setEditing(r);
    setForm({
      studentName: r.studentName,
      examName: r.examName,
      score: r.score,
      track: r.track,
      examYear: r.examYear,
      isPublished: r.isPublished,
      sortOrder: r.sortOrder,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/admin/results', {
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

  const togglePublish = async (r: Result) => {
    const res = await fetch('/api/admin/results', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, isPublished: !r.isPublished }),
    });
    if (res.ok) {
      toast.success(r.isPublished ? 'Hidden' : 'Published!');
      fetch_();
    }
  };

  const del = async (r: Result) => {
    if (!confirm(`Delete result for "${r.studentName}"?`)) return;
    const res = await fetch('/api/admin/results', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id }),
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
          <h1 className="text-3xl font-bold text-white mb-1">Student Results</h1>
          <p className="text-slate-400">Manage published student results and achievements shown on the website.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm"
        >
          <Plus size={16} /> Add Result
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit' : 'Add'} Result</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Student Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Arjun P."
                    value={form.studentName}
                    onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Track</label>
                  <select
                    value={form.track}
                    onChange={e => setForm(f => ({ ...f, track: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm cursor-pointer"
                  >
                    {Object.entries(TRACK_LABELS).map(([key, label]) => (
                      <option key={key} value={key} className="bg-[#0F2E5A]">{label}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Exam Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. JEE Advanced 2023"
                    value={form.examName}
                    onChange={e => setForm(f => ({ ...f, examName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Score / Rank *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. AIR 4,200 or 98.7%ile"
                    value={form.score}
                    onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Exam Year</label>
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    value={form.examYear}
                    onChange={e => setForm(f => ({ ...f, examYear: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
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
                <div className="sm:col-span-2 flex items-center">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative ${form.isPublished ? 'bg-brand-green' : 'bg-white/10'}`}
                      onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-slate-300">Publish on website</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 text-sm disabled:opacity-50"
                >
                  {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Check size={16} />}
                  {editing ? 'Save Changes' : 'Add Result'}
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

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <Trophy size={36} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No results yet. Click &quot;Add Result&quot; to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">Exam</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">Score</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Track</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Year</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r, i) => (
                  <tr key={r.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                    <td className="px-4 py-3 text-white font-medium">{r.studentName}</td>
                    <td className="px-4 py-3 text-slate-300">{r.examName}</td>
                    <td className="px-4 py-3 text-brand-amber font-semibold">{r.score}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {TRACK_LABELS[r.track] ?? r.track}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{r.examYear}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${r.isPublished ? 'bg-brand-green/15 text-brand-green border-brand-green/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                        {r.isPublished ? '● Published' : '○ Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(r)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => togglePublish(r)} title={r.isPublished ? 'Hide' : 'Publish'} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                          {r.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => del(r)} title="Delete" className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
