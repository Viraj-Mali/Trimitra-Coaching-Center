'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, ChevronDown, ChevronRight, Eye, EyeOff, X, Check, BookOpen, Star } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  topics: string;
  priority: string;
  examRelevance: string;
  sortOrder: number;
  isImportant: boolean;
  isActive: boolean;
  sourceNote: string;
}
interface Subject {
  id: string;
  name: string;
  sortOrder: number;
  chapters: Chapter[];
}
interface Syllabus {
  id: string;
  courseId: string;
  boardExam: string;
  academicYear: string;
  isActive: boolean;
  sortOrder: number;
  sourceNote: string;
  subjects: Subject[];
  course: { id: string; title: string; slug: string };
}
interface Course {
  id: string;
  title: string;
  slug: string;
  targetTrack: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  High: 'bg-red-500/15 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function SyllabusClient({ courses }: { courses: Course[] }) {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [showAddSyllabus, setShowAddSyllabus] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState<string | null>(null); // subjectId
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const [syllabusForm, setSyllabusForm] = useState({ boardExam: '', academicYear: '2024-25', sourceNote: '' });
  const [chapterForm, setChapterForm] = useState({ name: '', topics: '', priority: 'High', examRelevance: '', isImportant: false, sourceNote: '', sortOrder: 0 });

  const fetchSyllabi = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/syllabus?courseId=${selectedCourseId}&all=true`);
    const data = await res.json();
    setSyllabi(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedCourseId]);

  useEffect(() => { fetchSyllabi(); }, [fetchSyllabi]);

  const addSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/syllabus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: selectedCourseId, ...syllabusForm }),
    });
    if (res.ok) { toast.success('Syllabus created!'); setShowAddSyllabus(false); setSyllabusForm({ boardExam: '', academicYear: '2024-25', sourceNote: '' }); fetchSyllabi(); }
    else toast.error('Failed');
  };

  const toggleSyllabusActive = async (s: Syllabus) => {
    const res = await fetch('/api/admin/syllabus', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, isActive: !s.isActive }) });
    if (res.ok) { toast.success(s.isActive ? 'Syllabus hidden' : 'Syllabus published'); fetchSyllabi(); }
    else toast.error('Failed');
  };

  const deleteSyllabus = async (id: string) => {
    if (!confirm('Delete this syllabus? All subjects and chapters will be removed.')) return;
    const res = await fetch('/api/admin/syllabus', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success('Deleted'); fetchSyllabi(); }
    else toast.error('Failed');
  };

  const addChapter = async (e: React.FormEvent, subjectId: string) => {
    e.preventDefault();
    const res = await fetch('/api/admin/syllabus', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subject', id: subjectId }),
    });
    // Add chapter directly via a chapter-create endpoint — we'll do it through syllabus PATCH with chapter data
    const createRes = await fetch('/api/admin/syllabus/chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId, ...chapterForm }),
    });
    if (createRes.ok) {
      toast.success('Chapter added!'); setShowAddChapter(null);
      setChapterForm({ name: '', topics: '', priority: 'High', examRelevance: '', isImportant: false, sourceNote: '', sortOrder: 0 });
      fetchSyllabi();
    } else toast.error('Failed to add chapter');
  };

  const updateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;
    const { id, ...rest } = editingChapter;
    const res = await fetch('/api/admin/syllabus', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'chapter', id, ...rest }),
    });
    if (res.ok) { toast.success('Chapter updated!'); setEditingChapter(null); fetchSyllabi(); }
    else toast.error('Failed');
  };

  const toggleChapterImportant = async (ch: Chapter) => {
    const res = await fetch('/api/admin/syllabus', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'chapter', id: ch.id, isImportant: !ch.isImportant }) });
    if (res.ok) fetchSyllabi();
    else toast.error('Failed');
  };

  const deleteChapter = async (id: string) => {
    if (!confirm('Delete this chapter?')) return;
    const res = await fetch('/api/admin/syllabus', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'chapter', id }) });
    if (res.ok) { toast.success('Chapter deleted'); fetchSyllabi(); }
    else toast.error('Failed');
  };

  const toggleSubjectExpand = (id: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Syllabus Management</h1>
          <p className="text-slate-400">Manage chapter-wise syllabus for each course. Published syllabus appears on course detail pages.</p>
        </div>
        <button onClick={() => setShowAddSyllabus(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm">
          <Plus size={16} /> Add Syllabus
        </button>
      </div>

      {/* Course Selector */}
      <div className="flex gap-2 flex-wrap">
        {courses.map(c => (
          <button key={c.id} onClick={() => setSelectedCourseId(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedCourseId === c.id ? 'bg-brand-green/20 border-brand-green/50 text-brand-green' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}>
            {c.title}
          </button>
        ))}
      </div>

      {/* Add Syllabus Form */}
      {showAddSyllabus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Add New Syllabus</h2>
              <button onClick={() => setShowAddSyllabus(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={addSyllabus} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Board / Exam Name *</label>
                <input required type="text" placeholder="e.g. Maharashtra SSC Board 10th" value={syllabusForm.boardExam}
                  onChange={e => setSyllabusForm(f => ({ ...f, boardExam: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Academic Year</label>
                <input type="text" placeholder="2024-25" value={syllabusForm.academicYear}
                  onChange={e => setSyllabusForm(f => ({ ...f, academicYear: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Source Note</label>
                <textarea rows={2} placeholder="Based on NTA JEE Main 2024 Information Bulletin..." value={syllabusForm.sourceNote}
                  onChange={e => setSyllabusForm(f => ({ ...f, sourceNote: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 text-sm flex items-center justify-center gap-2">
                  <Check size={16} /> Create Syllabus
                </button>
                <button type="button" onClick={() => setShowAddSyllabus(false)} className="px-4 py-2.5 border border-white/20 text-slate-300 rounded-xl hover:bg-white/5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter Edit Modal */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Edit Chapter</h2>
              <button onClick={() => setEditingChapter(null)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={updateChapter} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Chapter Name *</label>
                <input required type="text" value={editingChapter.name}
                  onChange={e => setEditingChapter(c => c ? { ...c, name: e.target.value } : null)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Topics (comma-separated)</label>
                <textarea rows={2} value={editingChapter.topics}
                  onChange={e => setEditingChapter(c => c ? { ...c, topics: e.target.value } : null)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Priority</label>
                  <select value={editingChapter.priority} onChange={e => setEditingChapter(c => c ? { ...c, priority: e.target.value } : null)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm cursor-pointer">
                    {['High', 'Medium', 'Low'].map(p => <option key={p} value={p} className="bg-[#0F2E5A]">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Exam Relevance</label>
                  <input type="text" value={editingChapter.examRelevance} placeholder="JEE,NEET,Board"
                    onChange={e => setEditingChapter(c => c ? { ...c, examRelevance: e.target.value } : null)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingChapter.isImportant} onChange={e => setEditingChapter(c => c ? { ...c, isImportant: e.target.checked } : null)} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">Mark as important chapter</span>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 text-sm flex items-center justify-center gap-2">
                  <Check size={16} /> Save Changes
                </button>
                <button type="button" onClick={() => setEditingChapter(null)} className="px-4 py-2.5 border border-white/20 text-slate-300 rounded-xl hover:bg-white/5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Syllabi List */}
      {loading ? (
        <div className="glass-card p-8 text-center text-slate-400">Loading syllabus data...</div>
      ) : syllabi.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <BookOpen size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No syllabus yet for this course. Click &quot;Add Syllabus&quot; to create one.</p>
        </div>
      ) : syllabi.map(syl => (
        <div key={syl.id} className="glass-card overflow-hidden">
          {/* Syllabus Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 cursor-pointer"
            onClick={() => setExpandedSyllabus(expandedSyllabus === syl.id ? null : syl.id)}>
            <div className="flex items-center gap-4">
              {expandedSyllabus === syl.id ? <ChevronDown size={18} className="text-brand-green" /> : <ChevronRight size={18} className="text-slate-400" />}
              <div>
                <h3 className="text-white font-bold">{syl.boardExam}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{syl.academicYear} · {syl.subjects.length} subjects · {syl.subjects.reduce((a, s) => a + s.chapters.length, 0)} chapters</p>
                {syl.sourceNote && <p className="text-slate-500 text-xs mt-0.5 italic">Source: {syl.sourceNote}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${syl.isActive ? 'bg-brand-green/15 text-brand-green border-brand-green/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                {syl.isActive ? 'Published' : 'Hidden'}
              </span>
              <button onClick={() => toggleSyllabusActive(syl)} title={syl.isActive ? 'Hide' : 'Publish'} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                {syl.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => deleteSyllabus(syl.id)} title="Delete" className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Expanded Subjects & Chapters */}
          {expandedSyllabus === syl.id && (
            <div className="p-4 space-y-3">
              {syl.subjects.map(sub => (
                <div key={sub.id} className="border border-white/10 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-white/3 cursor-pointer"
                    onClick={() => toggleSubjectExpand(sub.id)}>
                    <div className="flex items-center gap-3">
                      {expandedSubjects.has(sub.id) ? <ChevronDown size={16} className="text-brand-amber" /> : <ChevronRight size={16} className="text-slate-500" />}
                      <span className="text-white font-semibold text-sm">{sub.name}</span>
                      <span className="text-slate-500 text-xs">({sub.chapters.length} chapters)</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setShowAddChapter(sub.id); setChapterForm({ name: '', topics: '', priority: 'High', examRelevance: '', isImportant: false, sourceNote: '', sortOrder: sub.chapters.length }); }}
                      className="flex items-center gap-1 text-xs text-brand-green hover:text-brand-green/80 px-2 py-1 rounded-lg border border-brand-green/30 bg-brand-green/10">
                      <Plus size={12} /> Add Chapter
                    </button>
                  </div>

                  {/* Add Chapter Inline Form */}
                  {showAddChapter === sub.id && (
                    <div className="p-4 border-t border-white/10 bg-white/3">
                      <form onSubmit={e => addChapter(e, sub.id)} className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <input required type="text" placeholder="Chapter name *" value={chapterForm.name}
                            onChange={e => setChapterForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <input type="text" placeholder="Key topics (comma-separated)" value={chapterForm.topics}
                            onChange={e => setChapterForm(f => ({ ...f, topics: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                        </div>
                        <select value={chapterForm.priority} onChange={e => setChapterForm(f => ({ ...f, priority: e.target.value }))}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-green cursor-pointer">
                          {['High', 'Medium', 'Low'].map(p => <option key={p} value={p} className="bg-[#0F2E5A]">{p} Priority</option>)}
                        </select>
                        <input type="text" placeholder="Exam relevance: JEE,NEET,Board" value={chapterForm.examRelevance}
                          onChange={e => setChapterForm(f => ({ ...f, examRelevance: e.target.value }))}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-green" />
                        <div className="sm:col-span-2 flex gap-3">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                            <input type="checkbox" checked={chapterForm.isImportant} onChange={e => setChapterForm(f => ({ ...f, isImportant: e.target.checked }))} className="w-4 h-4 rounded" />
                            Mark as important
                          </label>
                        </div>
                        <div className="sm:col-span-2 flex gap-2">
                          <button type="submit" className="px-4 py-2 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-lg text-sm hover:bg-brand-green/30">
                            Add Chapter
                          </button>
                          <button type="button" onClick={() => setShowAddChapter(null)} className="px-4 py-2 border border-white/20 text-slate-400 rounded-lg text-sm hover:bg-white/5">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {expandedSubjects.has(sub.id) && (
                    <div className="divide-y divide-white/5">
                      {sub.chapters.map((ch, idx) => (
                        <div key={ch.id} className="flex items-start justify-between px-4 py-3 hover:bg-white/3 transition-colors">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-slate-500 text-xs mt-0.5 w-5 shrink-0">{idx + 1}.</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-white text-sm font-medium">{ch.name}</p>
                                {ch.isImportant && <Star size={12} className="text-brand-amber fill-brand-amber" />}
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[ch.priority] || PRIORITY_COLORS.Medium}`}>{ch.priority}</span>
                                {ch.examRelevance && ch.examRelevance.split(',').map(er => (
                                  <span key={er} className="text-xs px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">{er.trim()}</span>
                                ))}
                              </div>
                              {ch.topics && <p className="text-slate-500 text-xs mt-0.5 truncate">{ch.topics}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            <button onClick={() => toggleChapterImportant(ch)} title={ch.isImportant ? 'Remove importance' : 'Mark important'} className={`p-1.5 rounded-lg transition-all ${ch.isImportant ? 'text-brand-amber' : 'text-slate-500 hover:text-brand-amber'}`}>
                              <Star size={13} className={ch.isImportant ? 'fill-current' : ''} />
                            </button>
                            <button onClick={() => setEditingChapter(ch)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => deleteChapter(ch.id)} title="Delete" className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
