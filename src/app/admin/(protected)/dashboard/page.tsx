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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card-hover p-4 sm:p-5 relative overflow-hidden group cursor-pointer">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center mb-3 ${stat.bg} shadow-lg`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-slate-400 text-xs sm:text-sm font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Leads */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-green rounded-full inline-block"></span>
            Recent Leads
          </h2>
          <Link href="/admin/leads" className="text-brand-green text-sm hover:text-brand-green-light hover:underline font-medium transition-colors">View all →</Link>
        </div>
        
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {recentLeads.map(lead => (
            <div key={lead.id} className="p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-white text-sm">{lead.studentName}</div>
                  <div className="text-xs text-slate-400">{lead.parentName}</div>
                </div>
                <span className={`badge text-[10px] px-2 py-0.5 ${STATUS_COLORS[lead.status]}`}>
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Mobile</span>
                  <a href={`tel:${lead.mobile}`} className="text-brand-green font-medium">{lead.mobile}</a>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Track</span>
                  <span className="text-slate-300 font-medium">{TRACK_LABELS[lead.track]}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-xs text-slate-500 border-t border-white/5 pt-3">
                <span>Std: {lead.standard}</span>
                <span>{formatRelativeTime(lead.createdAt)}</span>
              </div>
            </div>
          ))}
          {recentLeads.length === 0 && (
            <div className="text-center text-slate-500 py-6 text-sm">No leads yet</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto p-2">
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
                <tr key={lead.id} className="group transition-colors">
                  <td>
                    <div className="font-medium text-white group-hover:text-brand-green-light transition-colors">{lead.studentName}</div>
                    <div className="text-xs text-slate-500">{lead.parentName}</div>
                  </td>
                  <td><a href={`tel:${lead.mobile}`} className="text-brand-green hover:underline font-medium">{lead.mobile}</a></td>
                  <td>{lead.standard}</td>
                  <td>
                    <span className="text-xs text-slate-300 font-medium">{TRACK_LABELS[lead.track]}</span>
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
                <tr><td colSpan={6} className="text-center text-slate-500 py-8">No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
