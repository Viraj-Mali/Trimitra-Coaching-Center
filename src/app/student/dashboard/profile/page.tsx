import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import StreakFlame from '@/components/StreakFlame';
import XPBadge from '@/components/XPBadge';
import { formatDate, TRACK_LABELS } from '@/lib/utils';
import { User, Phone, BookOpen, Star } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    include: { testMarks: { orderBy: { takenAt: 'desc' }, take: 10 } },
  });
  if (!student) redirect('/student/login');

  const avgScore = student.testMarks.length > 0
    ? Math.round(student.testMarks.reduce((sum, m) => sum + (m.score / m.totalMarks) * 100, 0) / student.testMarks.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">My Profile</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-blue-light rounded-2xl flex items-center justify-center text-2xl font-black text-white">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <p className="text-brand-amber font-mono text-sm">{student.rollNumber}</p>
              <span className={`badge text-xs mt-1 ${student.role === 'ENROLLED' ? 'bg-brand-green/20 text-brand-green border-brand-green/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
                {student.role === 'ENROLLED' ? '⭐ Enrolled Student' : student.role === 'ADMIN' ? '🛡️ Administrator' : 'Free Trial'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-slate-400" />
              <span className="text-slate-300">{student.mobile}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BookOpen size={16} className="text-slate-400" />
              <span className="text-slate-300">{TRACK_LABELS[student.track]} — {student.standard}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User size={16} className="text-slate-400" />
              <span className="text-slate-300">Joined {formatDate(student.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4">Gamification Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white/5 rounded-xl p-4">
              <StreakFlame count={student.streakCount} size="sm" />
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <XPBadge xp={student.totalXP} size="sm" />
              <p className="text-slate-400 text-xs mt-2">Total XP</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-black text-brand-blue-light mb-1">{student.testMarks.length}</div>
              <p className="text-slate-400 text-xs">Tests Taken</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-black text-brand-green mb-1">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</div>
              <p className="text-slate-400 text-xs">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test History */}
      {student.testMarks.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Star size={18} className="text-brand-amber" /> Test History
          </h3>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr><th>Exam Title</th><th>Score</th><th>Percentage</th><th>Date</th></tr>
              </thead>
              <tbody>
                {student.testMarks.map(mark => (
                  <tr key={mark.id}>
                    <td className="text-white font-medium">{mark.examTitle}</td>
                    <td>{mark.score}/{mark.totalMarks}</td>
                    <td>
                      <span className={`font-bold ${(mark.score / mark.totalMarks) >= 0.6 ? 'text-brand-green' : 'text-brand-amber'}`}>
                        {Math.round((mark.score / mark.totalMarks) * 100)}%
                      </span>
                    </td>
                    <td className="text-slate-500 text-xs">{formatDate(mark.takenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
