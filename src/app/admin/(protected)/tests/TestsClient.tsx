'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, BarChart2 } from 'lucide-react';
import { TRACK_LABELS, formatDate } from '@/lib/utils';

interface Student { id: string; name: string; rollNumber: string; track: string; }

export default function TestsClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({ examTitle: '', score: '', totalMarks: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/students').then(r => r.json()).then(data => setStudents(Array.isArray(data) ? data : []));
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a student'); return; }
    setSubmitting(true);
    const res = await fetch('/api/admin/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: selected, ...form }),
    });
    const data = await res.json();
    if (res.ok) { toast.success('Score pushed successfully'); setForm({ examTitle: '', score: '', totalMarks: '' }); setSelected(''); }
    else toast.error(data.error || 'Failed to push score');
    setSubmitting(false);
  };

  const selectedStudent = students.find(s => s.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Test Scores</h1>
        <p className="text-slate-400">Push test scores to individual student profiles.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Search size={18} className="text-brand-green" /> Select Student</h3>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name or roll..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filtered.slice(0, 20).map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                  selected === s.id ? 'bg-brand-green/20 border-brand-green text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{s.rollNumber}</p>
                </div>
                <span className="text-xs text-slate-400">{TRACK_LABELS[s.track]?.split('(')[0]}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No students found</p>}
          </div>
        </div>

        {/* Score Form */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-brand-amber" /> Push Score</h3>

          {selectedStudent && (
            <div className="glass-card p-3 mb-4 border border-brand-green/30">
              <p className="text-brand-green text-sm font-semibold">Selected: {selectedStudent.name}</p>
              <p className="text-slate-400 text-xs font-mono">{selectedStudent.rollNumber}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Exam Title * (e.g. Physics Unit Test 1)"
              value={form.examTitle}
              onChange={e => setForm(f => ({ ...f, examTitle: e.target.value }))}
              className="input-field"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Score Obtained *"
                value={form.score}
                onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                className="input-field"
                min="0"
                required
              />
              <input
                type="number"
                placeholder="Total Marks *"
                value={form.totalMarks}
                onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))}
                className="input-field"
                min="1"
                required
              />
            </div>
            {form.score && form.totalMarks && (
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <span className="text-2xl font-black text-brand-amber">
                  {Math.round((Number(form.score) / Number(form.totalMarks)) * 100)}%
                </span>
                <span className="text-slate-400 text-sm ml-2">({form.score}/{form.totalMarks})</span>
              </div>
            )}
            <button type="submit" disabled={!selected || submitting} className="btn-primary w-full justify-center disabled:opacity-50">
              {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📊 Push Score'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
