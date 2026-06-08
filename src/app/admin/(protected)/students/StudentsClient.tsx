'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, UserCheck, UserX, Star, Flame } from 'lucide-react';
import { TRACK_LABELS, ROLE_LABELS, formatDate } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  mobile: string;
  rollNumber: string;
  role: string;
  track: string;
  standard: string;
  streakCount: number;
  totalXP: number;
  lastActiveAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  FREE: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  ENROLLED: 'bg-brand-green/20 text-brand-green border-brand-green/30',
  ADMIN: 'bg-brand-amber/20 text-brand-amber border-brand-amber/30',
};

export default function StudentsClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (trackFilter) params.set('track', trackFilter);
    if (roleFilter) params.set('role', roleFilter);
    const res = await fetch(`/api/admin/students?${params}`);
    setStudents(await res.json());
    setLoading(false);
  }, [search, trackFilter, roleFilter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const updateRole = async (id: string, role: string) => {
    const res = await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) { toast.success('Role updated'); fetchStudents(); }
    else toast.error('Failed to update role');
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    if (res.ok) { toast.success(isActive ? 'Account deactivated' : 'Account activated'); fetchStudents(); }
    else toast.error('Failed to update');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Student Management</h1>
        <p className="text-slate-400">View enrolled students, manage roles, and track performance.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by name, mobile, roll..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={trackFilter} onChange={e => setTrackFilter(e.target.value)} className="select-field w-auto">
          <option value="">All Tracks</option>
          {Object.entries(TRACK_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="select-field w-auto">
          <option value="">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Track / Standard</th>
                <th>Streak / XP</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7}><div className="h-4 bg-white/5 rounded shimmer-bg" /></td></tr>)
              ) : students.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-500">No students found</td></tr>
              ) : students.map(s => (
                <tr key={s.id} className={!s.isActive ? 'opacity-50' : ''}>
                  <td>
                    <div className="font-medium text-white">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.mobile}</div>
                  </td>
                  <td className="font-mono text-brand-amber text-xs">{s.rollNumber}</td>
                  <td>
                    <div className="text-xs text-slate-300">{TRACK_LABELS[s.track]}</div>
                    <div className="text-xs text-slate-500">{s.standard}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-brand-amber flex items-center gap-1"><Flame size={10} /> {s.streakCount}</span>
                      <span className="text-brand-green flex items-center gap-1"><Star size={10} /> {s.totalXP}</span>
                    </div>
                  </td>
                  <td>
                    <select
                      value={s.role}
                      onChange={e => updateRole(s.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${ROLE_COLORS[s.role]}`}
                    >
                      {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-brand-blue text-white">{v}</option>)}
                    </select>
                  </td>
                  <td className="text-slate-500 text-xs">{formatDate(s.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => toggleActive(s.id, s.isActive)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        s.isActive
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                          : 'bg-brand-green/10 border-brand-green/30 text-brand-green hover:bg-brand-green/20'
                      }`}
                    >
                      {s.isActive ? <><UserX size={12} /> Deactivate</> : <><UserCheck size={12} /> Activate</>}
                    </button>
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
