'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, Phone, UserPlus, ChevronDown, Copy, Eye } from 'lucide-react';
import { TRACK_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface Lead {
  id: string;
  studentName: string;
  parentName: string;
  mobile: string;
  standard: string;
  track: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

interface PromoteResult {
  rollNumber: string;
  tempPassword: string;
  name: string;
  upgraded?: boolean;
}

const STATUSES = ['PENDING', 'CALLED', 'DEMO_BOOKED', 'JOINED', 'REJECTED'];

export default function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [promoting, setPromoting] = useState<string | null>(null);
  const [promoteResult, setPromoteResult] = useState<PromoteResult | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (trackFilter) params.set('track', trackFilter);
    const res = await fetch(`/api/admin/leads?${params}`);
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }, [search, statusFilter, trackFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Status updated');
      fetchLeads();
    } else toast.error('Failed to update');
  };

  const promote = async (lead: Lead) => {
    if (!confirm(`Promote ${lead.studentName} to Enrolled Student?`)) return;
    setPromoting(lead.id);
    try {
      const res = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setPromoteResult(data);
        toast.success('Student promoted successfully!');
        fetchLeads();
      } else toast.error(data.error || 'Promotion failed');
    } catch { toast.error('Network error'); }
    finally { setPromoting(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Lead Management</h1>
        <p className="text-slate-400">Manage incoming enquiries and promote students to enrollment.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select value={trackFilter} onChange={e => setTrackFilter(e.target.value)} className="select-field w-auto">
          <option value="">All Tracks</option>
          {Object.entries(TRACK_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Promote Result Modal */}
      {promoteResult && (
        <div className="glass-card border border-brand-green/30 bg-brand-green/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-brand-green font-bold text-lg mb-2">✅ Student Account Created!</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white"><span className="text-slate-400">Name:</span> <strong>{promoteResult.name}</strong></p>
                <p className="text-white"><span className="text-slate-400">Roll Number:</span> <strong className="text-brand-amber">{promoteResult.rollNumber}</strong></p>
                {promoteResult.tempPassword && (
                  <p className="text-white flex items-center gap-2">
                    <span className="text-slate-400">Temp Password:</span>
                    <strong className="font-mono bg-white/10 px-2 py-0.5 rounded">{promoteResult.tempPassword}</strong>
                    <button onClick={() => { navigator.clipboard.writeText(promoteResult.tempPassword); toast.success('Copied!'); }}>
                      <Copy size={14} className="text-slate-400 hover:text-white" />
                    </button>
                  </p>
                )}
                {promoteResult.upgraded && <p className="text-slate-400 text-xs">(Existing account upgraded to ENROLLED)</p>}
              </div>
              <p className="text-slate-400 text-xs mt-3">Please share the Roll Number and Temp Password with the student.</p>
            </div>
            <button onClick={() => setPromoteResult(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student / Parent</th>
                <th>Mobile</th>
                <th>Standard / Track</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-3"><div className="h-4 bg-white/5 rounded shimmer-bg" /></td></tr>
                ))
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No leads found</td></tr>
              ) : leads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div className="font-medium text-white">{lead.studentName}</div>
                    <div className="text-xs text-slate-500">{lead.parentName}</div>
                    {lead.notes && (
                      <button onClick={() => setExpandedNotes(expandedNotes === lead.id ? null : lead.id)} className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                        <Eye size={10} /> Notes
                      </button>
                    )}
                    {expandedNotes === lead.id && lead.notes && (
                      <p className="text-xs text-slate-300 mt-1 bg-white/5 p-2 rounded">{lead.notes}</p>
                    )}
                  </td>
                  <td>
                    <a href={`tel:${lead.mobile}`} className="text-brand-green hover:underline flex items-center gap-1">
                      <Phone size={12} /> {lead.mobile}
                    </a>
                  </td>
                  <td>
                    <div className="text-white">{lead.standard}</div>
                    <div className="text-xs text-slate-400">{TRACK_LABELS[lead.track]}</div>
                  </td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s} className="bg-brand-blue text-white">{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="text-slate-500 text-xs">{formatDate(lead.createdAt)}</td>
                  <td>
                    {lead.status !== 'JOINED' && lead.status !== 'REJECTED' && (
                      <button
                        onClick={() => promote(lead)}
                        disabled={promoting === lead.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-semibold rounded-lg hover:bg-brand-green/30 transition-all disabled:opacity-50"
                      >
                        {promoting === lead.id ? (
                          <span className="w-3 h-3 border border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
                        ) : <UserPlus size={12} />}
                        Promote
                      </button>
                    )}
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
