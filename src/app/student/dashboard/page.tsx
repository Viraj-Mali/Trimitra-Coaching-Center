import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import StreakFlame from '@/components/StreakFlame';
import XPBadge from '@/components/XPBadge';
import { TRACK_LABELS, formatRelativeTime, getTodayDateString } from '@/lib/utils';
import { Bell, BookOpen, Zap, Trophy, ChevronRight, Lock, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const [student, notices, testMarks, recentQuiz, settings] = await Promise.all([
    prisma.student.findUnique({ where: { id: session.id } }),
    prisma.notice.findMany({
      where: { OR: [{ targetTrack: session.track }, { targetTrack: null }] },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.testMark.findMany({
      where: { studentId: session.id },
      orderBy: { takenAt: 'desc' },
      take: 5,
    }),
    prisma.quizAttempt.findFirst({
      where: { studentId: session.id },
      orderBy: { attemptedAt: 'desc' },
    }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ]);

  if (!student) redirect('/student/login');

  // Load actual syllabus subjects and chapters from the database for the student's track
  const courseWithSyllabus = await prisma.course.findFirst({
    where: { targetTrack: student.track, isActive: true },
    include: {
      syllabus: {
        where: { isActive: true },
        include: {
          subjects: {
            include: {
              chapters: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  const syllabus = courseWithSyllabus?.syllabus?.[0];
  const syllabusSubjects = syllabus?.subjects || [];
  const isEnrolled = student.role === 'ENROLLED' || student.role === 'ADMIN';
  const todayQuizDone = student.lastQuizDate === getTodayDateString();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
        <h1 className="text-3xl font-bold text-white">{student.name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">
          {TRACK_LABELS[student.track]} · {student.standard} · Roll: {student.rollNumber}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="glass-card p-5 text-center">
          <StreakFlame count={student.streakCount} size="md" />
        </div>

        {/* XP */}
        <div className="glass-card p-5 flex flex-col items-center justify-center gap-2">
          <XPBadge xp={student.totalXP} size="sm" />
          <p className="text-slate-400 text-xs">Total XP Earned</p>
        </div>

        {/* Tests Taken */}
        <div className="glass-card p-5 text-center">
          <div className="text-2xl font-black text-brand-blue-light mb-1">{testMarks.length}</div>
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
            <Trophy size={12} /> Tests Completed
          </p>
        </div>

        {/* Avg Score */}
        <div className="glass-card p-5 text-center">
          <div className="text-2xl font-black text-brand-green mb-1">
            {testMarks.length > 0
              ? `${Math.round(testMarks.reduce((sum, m) => sum + (m.score / m.totalMarks) * 100, 0) / testMarks.length)}%`
              : 'N/A'
            }
          </div>
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
            <TrendingUp size={12} /> Avg Test Score
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Course Syllabus & Chapters — 2/3 width */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <BookOpen size={18} className="text-brand-green" />
              Course Syllabus & Chapters
            </h2>
            {syllabus && (
              <span className="text-xs bg-brand-green/20 text-brand-green border border-brand-green/30 px-2.5 py-1 rounded-full font-medium">
                {syllabus.boardExam}
              </span>
            )}
          </div>
          
          {syllabusSubjects.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p>Syllabus chapters are being updated. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {syllabusSubjects.map((subject) => (
                <div key={subject.id} className="space-y-3">
                  <h3 className="text-white font-bold text-sm border-b border-white/10 pb-1.5 flex items-center justify-between">
                    <span>{subject.name}</span>
                    <span className="text-xs text-slate-400 font-normal">{subject.chapters.length} Chapters</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {subject.chapters.map((ch) => (
                      <div key={ch.id} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between hover:bg-white/8 transition-colors">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white font-semibold text-sm leading-snug">{ch.name}</h4>
                            {ch.isImportant && (
                              <span className="text-[10px] bg-brand-amber/20 border border-brand-amber/40 text-brand-amber px-1.5 py-0.5 rounded font-bold shrink-0">
                                IMP
                              </span>
                            )}
                          </div>
                          {ch.topics && (
                            <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{ch.topics}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                          <span className="text-[11px] text-slate-500">
                            Relevance: <span className="text-slate-300 font-medium">{ch.examRelevance || 'Board'}</span>
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            ch.priority === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 
                            ch.priority === 'Medium' ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/20' :
                            'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                          }`}>
                            {ch.priority} Priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Daily Quiz CTA */}
          <div className={`glass-card p-5 border ${todayQuizDone ? 'border-brand-green/30' : 'border-brand-amber/30'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className={todayQuizDone ? 'text-brand-green' : 'text-brand-amber'} />
              <h3 className="text-white font-bold">Daily Quiz</h3>
            </div>
            {todayQuizDone ? (
              <>
                <p className="text-brand-green text-sm font-medium mb-1">✓ Completed today!</p>
                <p className="text-slate-400 text-xs">Streak maintained. Come back tomorrow.</p>
              </>
            ) : (
              <>
                <p className="text-slate-300 text-sm mb-3">10 questions · Earn 50+ XP · Build your streak</p>
                <Link href="/student/dashboard/quiz" className="btn-primary text-sm py-2 w-full justify-center">
                  Start Quiz <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Premium Upgrade for FREE users */}
          {!isEnrolled && (
            <div className="glass-card p-5 border border-brand-amber/30 bg-brand-amber/5">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-brand-amber" />
                <h3 className="text-brand-amber font-bold text-sm">Upgrade to Premium</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Unlock all notes, formula sheets, weekly CBT mock tests, and performance analytics.
              </p>
              <a href={`tel:+91${settings?.phone || '9665269059'}`} className="btn-primary text-xs py-2 w-full justify-center">
                Contact to Enroll
              </a>
            </div>
          )}

          {/* Recent Test Scores */}
          {testMarks.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Trophy size={14} className="text-brand-amber" /> Recent Scores
              </h3>
              <div className="space-y-2">
                {testMarks.slice(0, 3).map(mark => (
                  <div key={mark.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 truncate max-w-[120px]">{mark.examTitle}</span>
                    <span className="font-bold text-brand-green">
                      {Math.round((mark.score / mark.totalMarks) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notices */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Bell size={18} className="text-brand-amber" />
            Recent Notices
          </h2>
          <Link href="/student/dashboard/notices" className="text-brand-green text-sm hover:underline">
            View all →
          </Link>
        </div>
        {notices.length === 0 ? (
          <p className="text-slate-400 text-sm">No notices yet.</p>
        ) : (
          <div className="space-y-3">
            {notices.map(notice => (
              <div key={notice.id} className={`p-4 rounded-xl border ${notice.isUrgent ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                      {notice.isUrgent && <span className="text-red-400 text-xs">🔴 URGENT</span>}
                      {notice.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{notice.body}</p>
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">{formatRelativeTime(notice.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
