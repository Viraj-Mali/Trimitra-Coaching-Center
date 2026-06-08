import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Bell, AlertCircle } from 'lucide-react';
import { formatDate, TRACK_LABELS } from '@/lib/utils';

export default async function NoticesPage() {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const notices = await prisma.notice.findMany({
    where: { OR: [{ targetTrack: session.track }, { targetTrack: null }] },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Notices</h1>
        <p className="text-slate-400">Announcements from Trimitra Coaching Centre.</p>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p>No notices posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <div
              key={notice.id}
              className={`glass-card p-6 border ${notice.isUrgent ? 'border-red-500/40 bg-red-500/5' : 'border-white/10'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notice.isUrgent ? 'bg-red-500/20' : 'bg-brand-amber/20'
                  }`}>
                    {notice.isUrgent
                      ? <AlertCircle size={20} className="text-red-400" />
                      : <Bell size={20} className="text-brand-amber" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {notice.isUrgent && (
                        <span className="badge bg-red-500/20 text-red-400 border-red-500/30 text-xs">🔴 Urgent</span>
                      )}
                      {notice.targetTrack && (
                        <span className="badge bg-brand-blue/50 text-blue-300 border-blue-500/30 text-xs">
                          {TRACK_LABELS[notice.targetTrack]}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-base mb-2">{notice.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{notice.body}</p>
                  </div>
                </div>
                <span className="text-slate-500 text-xs shrink-0">{formatDate(notice.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
