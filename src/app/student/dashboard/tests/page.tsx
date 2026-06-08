import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Lock, FileText, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function TestsPage() {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const [student, settings] = await Promise.all([
    prisma.student.findUnique({ where: { id: session.id } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ]);
  if (!student) redirect('/student/login');

  const phone = settings?.phone || '9665269059';
  const whatsapp = settings?.whatsapp || '9665269059';
  const isEnrolled = student.role === 'ENROLLED' || student.role === 'ADMIN';
  const testMarks = isEnrolled
    ? await prisma.testMark.findMany({ where: { studentId: student.id }, orderBy: { takenAt: 'desc' } })
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Mock Tests</h1>
        <p className="text-slate-400">Computer-based test format practice, modelled after JEE/NEET/MHT-CET.</p>
      </div>

      {!isEnrolled ? (
        <div className="glass-card border border-brand-amber/30 bg-brand-amber/5 p-10 text-center">
          <div className="w-20 h-20 bg-brand-amber/20 border border-brand-amber/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock size={36} className="text-brand-amber" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Premium Feature</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Mock tests are available for enrolled students only. Enroll at Trimitra Coaching Centre to access weekly CBT-format tests modelled exactly after your target exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:+91${phone}`} className="btn-primary">📞 Call to Enroll</a>
            <a href={`https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20for%20premium%20access%20to%20mock%20tests.`} className="btn-outline">💬 WhatsApp Us</a>
          </div>

          {/* Feature preview */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'CBT Format', desc: 'Exact exam interface for JEE, NEET & MHT-CET' },
              { icon: '📊', title: 'Performance Analytics', desc: 'Topic-wise accuracy and time analysis' },
              { icon: '📅', title: 'Weekly Tests', desc: 'Regular scheduled tests to track progress' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-1">{f.title}</h4>
                <p className="text-slate-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test History */}
          {testMarks.length > 0 ? (
            <div className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-green" /> Your Test History
              </h2>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr><th>Exam</th><th>Score</th><th>%</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {testMarks.map(mark => {
                      const pct = Math.round((mark.score / mark.totalMarks) * 100);
                      return (
                        <tr key={mark.id}>
                          <td className="font-medium text-white">{mark.examTitle}</td>
                          <td>{mark.score}/{mark.totalMarks}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${pct >= 60 ? 'bg-brand-green' : 'bg-brand-amber'}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className={`text-sm font-bold ${pct >= 60 ? 'text-brand-green' : 'text-brand-amber'}`}>{pct}%</span>
                            </div>
                          </td>
                          <td className="text-slate-500 text-xs">{formatDate(mark.takenAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card p-10 text-center border border-brand-green/20">
              <FileText size={40} className="text-brand-green mx-auto mb-4 opacity-50" />
              <h3 className="text-white font-bold text-lg mb-2">No Tests Yet</h3>
              <p className="text-slate-400 text-sm">
                Your test results will appear here once your teacher publishes them. Tests are conducted at the coaching centre and scores are updated by the admin.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
