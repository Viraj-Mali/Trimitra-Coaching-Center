import { prisma } from '@/lib/prisma';
import { Users, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { formatRelativeTime, STATUS_COLORS, STATUS_LABELS, TRACK_LABELS } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalLeads, enrolledStudents, activeToday, newLeads, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.student.count({ where: { role: 'ENROLLED' } }),
    prisma.student.count({ where: { lastActiveAt: { gte: today } } }),
    prisma.lead.count({ where: { status: 'PENDING', createdAt: { gte: today } } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  const stats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
    { label: 'Enrolled Students', value: enrolledStudents, icon: UserCheck, color: 'text-brand-green', bg: 'bg-brand-green/20 border-brand-green/30' },
    { label: 'Active Today', value: activeToday, icon: TrendingUp, color: 'text-brand-amber', bg: 'bg-brand-amber/20 border-brand-amber/30' },
    { label: 'New Leads Today', value: newLeads, icon: AlertCircle, color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-slate-400">Trimitra Coaching Centre — Management Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-3 ${stat.bg}`}>
                <Icon size={22} className={stat.color} />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Leads */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Recent Leads</h2>
          <Link href="/admin/leads" className="text-brand-green text-sm hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student / Parent</th>
                <th>Mobile</th>
                <th>Standard</th>
                <th>Track</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div className="font-medium text-white">{lead.studentName}</div>
                    <div className="text-xs text-slate-500">{lead.parentName}</div>
                  </td>
                  <td><a href={`tel:${lead.mobile}`} className="text-brand-green hover:underline">{lead.mobile}</a></td>
                  <td>{lead.standard}</td>
                  <td>
                    <span className="text-xs text-slate-300">{TRACK_LABELS[lead.track]}</span>
                  </td>
                  <td>
                    <span className={`badge text-xs ${STATUS_COLORS[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">{formatRelativeTime(lead.createdAt)}</td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr><td colSpan={6} className="text-center text-slate-500 py-6">No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
