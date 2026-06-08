'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, FileText, Bell, HelpCircle, Lock } from 'lucide-react';
import { TRACK_LABELS } from '@/lib/utils';

type Tab = 'materials' | 'notices' | 'quiz';

export default function ContentClient() {
  const [tab, setTab] = useState<Tab>('materials');
  const [materials, setMaterials] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Material form
  const [matForm, setMatForm] = useState({ title: '', description: '', fileUrl: '', targetTrack: 'ALL', isPremium: false, fileType: 'PDF' });
  // Notice form
  const [noticeForm, setNoticeForm] = useState({ title: '', body: '', targetTrack: '', isUrgent: false });
  // Quiz form
  const [quizForm, setQuizForm] = useState({
    question: '', optionA: '', optionB: '', optionC: '', optionD: '',
    correctIndex: 0, explanation: '', track: 'COMPETITIVE', subject: '',
  });

  const fetchAll = async () => {
    setLoading(true);
    const [mats, nots, quiz] = await Promise.all([
      fetch('/api/admin/materials').then(r => r.json()),
      fetch('/api/admin/notices').then(r => r.json()),
      fetch('/api/admin/quiz').then(r => r.json()),
    ]);
    setMaterials(Array.isArray(mats) ? mats : []);
    setNotices(Array.isArray(nots) ? nots : []);
    setQuizQuestions(Array.isArray(quiz) ? quiz : []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(matForm) });
    if (res.ok) { toast.success('Material added'); fetchAll(); setMatForm({ title: '', description: '', fileUrl: '', targetTrack: 'ALL', isPremium: false, fileType: 'PDF' }); }
    else toast.error('Failed to add material');
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    const res = await fetch('/api/admin/materials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success('Deleted'); fetchAll(); } else toast.error('Failed');
  };

  const addNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(noticeForm) });
    if (res.ok) { toast.success('Notice posted'); fetchAll(); setNoticeForm({ title: '', body: '', targetTrack: '', isUrgent: false }); }
    else toast.error('Failed');
  };

  const deleteNotice = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    const res = await fetch('/api/admin/notices', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success('Deleted'); fetchAll(); } else toast.error('Failed');
  };

  const addQuizQ = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quizForm) });
    if (res.ok) { toast.success('Question added'); fetchAll(); setQuizForm({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIndex: 0, explanation: '', track: 'COMPETITIVE', subject: '' }); }
    else toast.error('Failed');
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    const res = await fetch('/api/admin/quiz', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success('Deleted'); fetchAll(); } else toast.error('Failed');
  };

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: 'materials', label: 'Materials', icon: FileText },
    { key: 'notices', label: 'Notices', icon: Bell },
    { key: 'quiz', label: 'Quiz Questions', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Content & Materials</h1>
        <p className="text-slate-400">Upload study materials, post notices, and manage quiz questions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                tab === t.key ? 'border-brand-green text-brand-green' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Materials Tab */}
      {tab === 'materials' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-brand-green" /> Add Material</h3>
            <form onSubmit={addMaterial} className="space-y-3">
              <input type="text" placeholder="Title *" value={matForm.title} onChange={e => setMatForm(f => ({ ...f, title: e.target.value }))} className="input-field" required />
              <input type="text" placeholder="Description (optional)" value={matForm.description} onChange={e => setMatForm(f => ({ ...f, description: e.target.value }))} className="input-field" />
              <input type="url" placeholder="File URL *" value={matForm.fileUrl} onChange={e => setMatForm(f => ({ ...f, fileUrl: e.target.value }))} className="input-field" required />
              <div className="grid grid-cols-2 gap-3">
                <select value={matForm.targetTrack} onChange={e => setMatForm(f => ({ ...f, targetTrack: e.target.value }))} className="select-field">
                  <option value="ALL">All Tracks</option>
                  {Object.entries(TRACK_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={matForm.fileType} onChange={e => setMatForm(f => ({ ...f, fileType: e.target.value }))} className="select-field">
                  <option value="PDF">PDF</option>
                  <option value="VIDEO">Video</option>
                  <option value="LINK">Link</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={matForm.isPremium} onChange={e => setMatForm(f => ({ ...f, isPremium: e.target.checked }))} className="w-4 h-4" />
                <Lock size={14} className="text-brand-amber" /> Premium content
              </label>
              <button type="submit" className="btn-secondary w-full justify-center">Add Material</button>
            </form>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {materials.map((m: any) => (
              <div key={m.id} className="glass-card p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-medium text-sm truncate">{m.title}</span>
                    {m.isPremium && <span className="badge bg-brand-amber/20 text-brand-amber border-brand-amber/30 text-xs">Premium</span>}
                  </div>
                  <p className="text-slate-500 text-xs">{TRACK_LABELS[m.targetTrack] || m.targetTrack} · {m.fileType}</p>
                </div>
                <button onClick={() => deleteMaterial(m.id)} className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {materials.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No materials yet</p>}
          </div>
        </div>
      )}

      {/* Notices Tab */}
      {tab === 'notices' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-brand-amber" /> Post Notice</h3>
            <form onSubmit={addNotice} className="space-y-3">
              <input type="text" placeholder="Title *" value={noticeForm.title} onChange={e => setNoticeForm(f => ({ ...f, title: e.target.value }))} className="input-field" required />
              <textarea placeholder="Notice body *" value={noticeForm.body} onChange={e => setNoticeForm(f => ({ ...f, body: e.target.value }))} className="input-field resize-none" rows={4} required />
              <select value={noticeForm.targetTrack} onChange={e => setNoticeForm(f => ({ ...f, targetTrack: e.target.value }))} className="select-field">
                <option value="">Global (All Students)</option>
                {Object.entries(TRACK_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={noticeForm.isUrgent} onChange={e => setNoticeForm(f => ({ ...f, isUrgent: e.target.checked }))} className="w-4 h-4" />
                🔴 Mark as Urgent
              </label>
              <button type="submit" className="btn-primary w-full justify-center">Post Notice</button>
            </form>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notices.map((n: any) => (
              <div key={n.id} className={`glass-card p-4 border ${n.isUrgent ? 'border-red-500/30' : 'border-white/10'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-medium text-sm">{n.title}</p>
                    <p className="text-slate-400 text-xs line-clamp-2">{n.body}</p>
                    <p className="text-slate-500 text-xs mt-1">{n.targetTrack ? TRACK_LABELS[n.targetTrack] : 'Global'}</p>
                  </div>
                  <button onClick={() => deleteNotice(n.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {notices.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No notices yet</p>}
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {tab === 'quiz' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-blue-400" /> Add Quiz Question</h3>
            <form onSubmit={addQuizQ} className="space-y-3">
              <textarea placeholder="Question *" value={quizForm.question} onChange={e => setQuizForm(f => ({ ...f, question: e.target.value }))} className="input-field resize-none" rows={2} required />
              {['A', 'B', 'C', 'D'].map((opt, i) => (
                <div key={opt} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{opt}</span>
                  <input
                    type="text"
                    placeholder={`Option ${opt} *`}
                    value={(quizForm as any)[`option${opt}`]}
                    onChange={e => setQuizForm(f => ({ ...f, [`option${opt}`]: e.target.value }))}
                    className="input-field pl-8"
                    required
                  />
                </div>
              ))}
              <select value={quizForm.correctIndex} onChange={e => setQuizForm(f => ({ ...f, correctIndex: Number(e.target.value) }))} className="select-field">
                {['A', 'B', 'C', 'D'].map((opt, i) => <option key={i} value={i}>Correct: {opt}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={quizForm.track} onChange={e => setQuizForm(f => ({ ...f, track: e.target.value }))} className="select-field">
                  <option value="ALL">All Tracks</option>
                  {Object.entries(TRACK_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input type="text" placeholder="Subject (optional)" value={quizForm.subject} onChange={e => setQuizForm(f => ({ ...f, subject: e.target.value }))} className="input-field" />
              </div>
              <textarea placeholder="Explanation (optional)" value={quizForm.explanation} onChange={e => setQuizForm(f => ({ ...f, explanation: e.target.value }))} className="input-field resize-none" rows={2} />
              <button type="submit" className="btn-outline w-full justify-center">Add Question</button>
            </form>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {quizQuestions.map((q: any) => (
              <div key={q.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-2">{q.question}</p>
                    <div className="grid grid-cols-2 gap-1 text-xs text-slate-400 mb-2">
                      {['A', 'B', 'C', 'D'].map((opt, i) => (
                        <span key={opt} className={i === q.correctIndex ? 'text-brand-green font-semibold' : ''}>
                          {opt}: {q[`option${opt}`]}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-500 text-xs">{TRACK_LABELS[q.track] || q.track} · {q.subject}</p>
                  </div>
                  <button onClick={() => deleteQuiz(q.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {quizQuestions.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No questions yet</p>}
          </div>
        </div>
      )}
    </div>
  );
}
