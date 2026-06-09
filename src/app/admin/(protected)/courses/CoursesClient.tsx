'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Eye, EyeOff, GripVertical, X, BookOpen, Check } from 'lucide-react';
import { TRACK_LABELS } from '@/lib/utils';

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  subjects: string;
  targetTrack: string;
  targetClass: string;
  duration: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  whoShouldJoin: string;
  teachingMethodology: string;
  weeklyTestPlan: string;
  doubtSolvingSystem: string;
  studyMaterial: string;
  batchTiming: string;
  examPattern: string;
  metaTitle: string;
  metaDescription: string;
}

const BLANK_FORM = {
  slug: '', title: '', subtitle: '', description: '', subjects: '',
  targetTrack: 'FOUNDATION_6_9', targetClass: '', duration: '',
  isActive: true, sortOrder: 0,
  whoShouldJoin: '', teachingMethodology: '', weeklyTestPlan: '',
  doubtSolvingSystem: '', studyMaterial: '', batchTiming: '',
  examPattern: '', metaTitle: '', metaDescription: '',
};

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/courses');
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const openAdd = () => { setEditing(null); setForm(BLANK_FORM); setShowForm(true); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      slug: c.slug || '', title: c.title, subtitle: c.subtitle, description: c.description,
      subjects: c.subjects, targetTrack: c.targetTrack, targetClass: c.targetClass,
      duration: c.duration, isActive: c.isActive, sortOrder: c.sortOrder,
      whoShouldJoin: c.whoShouldJoin || '', teachingMethodology: c.teachingMethodology || '',
      weeklyTestPlan: c.weeklyTestPlan || '', doubtSolvingSystem: c.doubtSolvingSystem || '',
      studyMaterial: c.studyMaterial || '', batchTiming: c.batchTiming || '',
      examPattern: c.examPattern || '', metaTitle: c.metaTitle || '',
      metaDescription: c.metaDescription || '',
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/admin/courses', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editing ? 'Course updated!' : 'Course created!');
        setShowForm(false);
        fetchCourses();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed');
      }
    } catch { toast.error('Network error'); }
    setSaving(false);
  };

  const toggleActive = async (c: Course) => {
    const res = await fetch('/api/admin/courses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, isActive: !c.isActive }) });
    if (res.ok) { toast.success(c.isActive ? 'Course hidden' : 'Course published'); fetchCourses(); }
    else toast.error('Failed');
  };

  const deleteCourse = async (c: Course) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    const res = await fetch('/api/admin/courses', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id }) });
    if (res.ok) { toast.success('Course deleted'); fetchCourses(); }
    else toast.error('Failed to delete');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Course Management</h1>
          <p className="text-slate-400">Add, edit, publish, or hide courses shown on the website.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm">
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Course' : 'Add New Course'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Course Title *</label>
                  <input required type="text" placeholder="e.g. 10th Board Mastery" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Subtitle</label>
                  <input type="text" placeholder="Maharashtra SSC Board" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Target Track *</label>
                  <select required value={form.targetTrack} onChange={e => setForm(f => ({ ...f, targetTrack: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green text-sm cursor-pointer">
                    {Object.entries(TRACK_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-[#0F2E5A]">{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Target Class</label>
                  <input type="text" placeholder="e.g. 6th to 9th" value={form.targetClass} onChange={e => setForm(f => ({ ...f, targetClass: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Duration</label>
                  <input type="text" placeholder="e.g. 1 Year" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Sort Order</label>
                  <input type="number" min={0} placeholder="0" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Subjects * (comma-separated)</label>
                  <input required type="text" placeholder="Physics, Chemistry, Mathematics, Biology" value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea rows={3} placeholder="Short description of the course..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">URL Slug (auto-generated if blank)</label>
                  <input type="text" placeholder="e.g. 10th-board" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div className="sm:col-span-2 border-t border-white/10 pt-3">
                  <p className="text-xs text-brand-amber font-semibold uppercase tracking-wider mb-3">Rich Content (shown on course detail page)</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Who Should Join</label>
                  <textarea rows={2} placeholder="Who is this course for?" value={form.whoShouldJoin} onChange={e => setForm(f => ({ ...f, whoShouldJoin: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Teaching Methodology</label>
                  <textarea rows={2} placeholder="How do you teach?" value={form.teachingMethodology} onChange={e => setForm(f => ({ ...f, teachingMethodology: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Weekly Test Plan</label>
                  <textarea rows={2} placeholder="Describe test schedule..." value={form.weeklyTestPlan} onChange={e => setForm(f => ({ ...f, weeklyTestPlan: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Doubt Solving System</label>
                  <textarea rows={2} placeholder="How are doubts handled?" value={form.doubtSolvingSystem} onChange={e => setForm(f => ({ ...f, doubtSolvingSystem: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Study Material</label>
                  <textarea rows={2} placeholder="Notes, worksheets provided..." value={form.studyMaterial} onChange={e => setForm(f => ({ ...f, studyMaterial: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Batch Timing</label>
                  <textarea rows={2} placeholder="Morning: 7-9 AM, Evening: 5-7 PM..." value={form.batchTiming} onChange={e => setForm(f => ({ ...f, batchTiming: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Exam Pattern</label>
                  <textarea rows={2} placeholder="Describe the exam format..." value={form.examPattern} onChange={e => setForm(f => ({ ...f, examPattern: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div className="sm:col-span-2 border-t border-white/10 pt-3">
                  <p className="text-xs text-brand-amber font-semibold uppercase tracking-wider mb-3">SEO Metadata</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Meta Title (for Google)</label>
                  <input type="text" placeholder="10th Board Coaching Talegaon Dighe | Trimitra..." value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Meta Description (for Google, ~155 chars)</label>
                  <textarea rows={2} placeholder="Best 10th SSC coaching in Talegaon Dighe near Sangamner..." value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-brand-green' : 'bg-white/10'}`} onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">Publish this course (visible on website)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 transition-all text-sm disabled:opacity-50">
                  {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Check size={16} />}
                  {editing ? 'Save Changes' : 'Create Course'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-white/20 text-slate-300 rounded-xl hover:bg-white/5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Track</th>
                <th>Subjects</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}><td colSpan={6}><div className="h-5 bg-white/5 rounded shimmer-bg" /></td></tr>
                ))
              ) : courses.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-500">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                  No courses yet. Click &quot;Add Course&quot; to create your first one.
                </td></tr>
              ) : courses.map(course => (
                <tr key={course.id}>
                  <td>
                    <div className="font-medium text-white">{course.title}</div>
                    {course.subtitle && <div className="text-xs text-slate-500 mt-0.5">{course.subtitle}</div>}
                    {course.targetClass && <div className="text-xs text-slate-600">{course.targetClass}</div>}
                  </td>
                  <td>
                    <span className="text-xs text-slate-300">{TRACK_LABELS[course.targetTrack] || course.targetTrack}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {course.subjects.split(',').map(s => (
                        <span key={s} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-md">{s.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-slate-400 text-sm">{course.duration || '—'}</td>
                  <td>
                    <span className={`badge text-xs ${course.isActive ? 'bg-brand-green/15 text-brand-green border-brand-green/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                      {course.isActive ? '● Published' : '○ Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(course)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => toggleActive(course)} title={course.isActive ? 'Hide' : 'Publish'} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        {course.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => deleteCourse(course)} title="Delete" className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
