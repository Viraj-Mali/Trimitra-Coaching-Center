import { prisma } from '@/lib/prisma';
import DemoFormClient from '@/components/DemoFormClient';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Users, ChevronDown, MessageCircle, Star, Target, Calendar, FileText, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

interface Props { params: { lang: string; track: string } }

// Normalize track slug to DB targetTrack
function slugToTrack(slug: string): string {
  const map: Record<string, string> = {
    'foundation-6-to-9': 'FOUNDATION_6_9',
    'foundation_6_9': 'FOUNDATION_6_9',
    '10th-board': 'BOARD_10',
    'board_10': 'BOARD_10',
    '11-12-science': 'SCIENCE_11_12',
    'science_11_12': 'SCIENCE_11_12',
    'jee-neet-mht-cet-nata': 'COMPETITIVE',
    'competitive': 'COMPETITIVE',
  };
  return map[slug] || slug.toUpperCase().replace(/-/g, '_');
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-red-500/15 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const TRACK_ACCENT: Record<string, { color: string; border: string; icon: string }> = {
  FOUNDATION_6_9: { color: 'text-purple-400', border: 'border-purple-500/40', icon: '📚' },
  BOARD_10: { color: 'text-blue-400', border: 'border-blue-500/40', icon: '🎯' },
  SCIENCE_11_12: { color: 'text-brand-green', border: 'border-brand-green/40', icon: '🔬' },
  COMPETITIVE: { color: 'text-brand-amber', border: 'border-brand-amber/40', icon: '🏆' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = params;
  const targetTrack = slugToTrack(track);
  const course = await prisma.course.findFirst({ where: { OR: [{ slug: track }, { targetTrack }] } });
  if (!course) return { title: 'Course | Trimitra Coaching Centre' };
  return {
    title: course.metaTitle || `${course.title} | Trimitra Coaching Centre, Talegaon Dighe Pune`,
    description: course.metaDescription || course.description || `Expert coaching for ${course.title} in Talegaon Dighe, Pune. Small batches, personal attention, structured preparation.`,
    keywords: `${course.title} coaching Pune, ${course.targetClass} tuition Talegaon Dighe, best coaching classes Pune`,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { lang, track } = params;
  const targetTrack = slugToTrack(track);

  // Fetch course by slug OR targetTrack
  const course = await prisma.course.findFirst({
    where: { OR: [{ slug: track }, { targetTrack }] },
    include: {
      syllabus: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          subjects: {
            orderBy: { sortOrder: 'asc' },
            include: { chapters: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
          },
        },
      },
      faqs: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
    },
  });

  // Fallback for old track keys
  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Course not found.</p>
        <Link href={`/${lang}`} className="text-brand-green hover:underline mt-4 block">← Back to Home</Link>
      </div>
    );
  }

  // Also fetch global FAQs
  const globalFAQs = await prisma.fAQ.findMany({
    where: { isActive: true, courseId: null },
    orderBy: { sortOrder: 'asc' },
    take: 4,
  });

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  const whatsapp = settings?.whatsapp || '9665269059';
  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(course.title)}%20at%20Trimitra%20Coaching%20Centre.`;

  const accent = TRACK_ACCENT[course.targetTrack] || TRACK_ACCENT.COMPETITIVE;
  const allFAQs = [...(course.faqs || []), ...globalFAQs].slice(0, 8);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href={`/${lang}#courses`} className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-green mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to All Courses
        </Link>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className={`glass-card border-2 ${accent.border} p-8 mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-3 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-5xl shrink-0">{accent.icon}</div>
              <div className="flex-1">
                <p className={`text-sm font-semibold mb-1 ${accent.color}`}>{course.subtitle || course.targetClass}</p>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{course.title}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.subjects.split(',').map(s => (
                    <span key={s} className="badge bg-white/10 text-slate-300 border-white/20 text-xs">{s.trim()}</span>
                  ))}
                </div>
                {course.duration && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                    {course.targetClass && <><span className="text-white/20">·</span><Users size={14} /><span>{course.targetClass}</span></>}
                  </div>
                )}
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href="#enroll-form-course" className="flex items-center gap-2 px-6 py-3 bg-brand-amber hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 text-sm">
                <Calendar size={16} />
                Enroll Now
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-green-600/20 border border-green-500/40 text-green-400 font-semibold rounded-xl hover:bg-green-600/30 transition-all text-sm">
                <MessageCircle size={16} />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Course Overview */}
            {course.description && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <BookOpen size={18} className={accent.color} /> Course Overview
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* Who Should Join */}
            {course.whoShouldJoin && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <Users size={18} className={accent.color} /> Who Should Join?
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.whoShouldJoin}</p>
              </div>
            )}

            {/* Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <FileText size={18} className={accent.color} /> Chapter-wise Syllabus
                </h2>
                {course.syllabus.map((syl) => (
                  <div key={syl.id} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-px flex-1 bg-gradient-to-r from-white/20 to-transparent`} />
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{syl.boardExam} · {syl.academicYear}</span>
                      <div className={`h-px flex-1 bg-gradient-to-l from-white/20 to-transparent`} />
                    </div>
                    {syl.sourceNote && (
                      <p className="text-xs text-slate-500 italic mb-3">Source: {syl.sourceNote}</p>
                    )}
                    {syl.subjects.map((sub) => (
                      <details key={sub.id} className="group mb-3">
                        <summary className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer list-none hover:bg-white/8 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-semibold text-sm">{sub.name}</span>
                            <span className="text-slate-500 text-xs">({sub.chapters.length} chapters)</span>
                          </div>
                          <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                        </summary>
                        <div className="divide-y divide-white/5 border border-white/10 border-t-0 rounded-b-xl overflow-hidden">
                          {sub.chapters.map((ch, idx) => (
                            <div key={ch.id} className="flex items-start justify-between px-4 py-3 bg-white/2 hover:bg-white/5 transition-colors">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-slate-500 text-xs mt-0.5 w-5 shrink-0">{idx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-white text-sm font-medium">
                                      {ch.isImportant && <Star size={11} className="inline text-brand-amber fill-brand-amber mr-1" />}
                                      {ch.name}
                                    </p>
                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[ch.priority] || PRIORITY_STYLES.Medium}`}>{ch.priority}</span>
                                    {ch.examRelevance && ch.examRelevance.split(',').map(er => er.trim()).filter(Boolean).map(er => (
                                      <span key={er} className="text-xs px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">{er}</span>
                                    ))}
                                  </div>
                                  {ch.topics && <p className="text-slate-500 text-xs mt-0.5">{ch.topics}</p>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Exam Pattern */}
            {course.examPattern && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <Target size={18} className={accent.color} /> Exam Pattern
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{course.examPattern}</p>
              </div>
            )}

            {/* Teaching Methodology */}
            {course.teachingMethodology && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <BookOpen size={18} className={accent.color} /> Teaching Methodology
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.teachingMethodology}</p>
              </div>
            )}

            {/* Weekly Test Plan */}
            {course.weeklyTestPlan && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <Calendar size={18} className={accent.color} /> Weekly Test Plan
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.weeklyTestPlan}</p>
              </div>
            )}

            {/* Doubt Solving */}
            {course.doubtSolvingSystem && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <HelpCircle size={18} className={accent.color} /> Doubt-Solving System
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.doubtSolvingSystem}</p>
              </div>
            )}

            {/* FAQs */}
            {allFAQs.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <HelpCircle size={18} className={accent.color} /> Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {allFAQs.map((faq) => (
                    <details key={faq.id} className="group border border-white/10 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-white/5 transition-colors">
                        <span className="text-white text-sm font-semibold pr-4">{faq.question}</span>
                        <ChevronDown size={16} className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <div className="space-y-5">

            {/* Study Material */}
            {course.studyMaterial && (
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <FileText size={16} className={accent.color} /> Study Material
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{course.studyMaterial}</p>
              </div>
            )}

            {/* Batch Timing */}
            {course.batchTiming && (
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Clock size={16} className={accent.color} /> Batch Timings
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{course.batchTiming}</p>
              </div>
            )}

            {/* Key Subjects */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <BookOpen size={16} className={accent.color} /> Subjects Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.subjects.split(',').map(s => (
                  <span key={s} className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg font-medium">{s.trim()}</span>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className={`glass-card border-2 ${accent.border} p-5 text-center sticky top-6`}>
              <div className="text-3xl mb-3">{accent.icon}</div>
              <h3 className="text-white font-black text-lg mb-1">{course.title}</h3>
              <p className="text-slate-400 text-xs mb-5">{course.targetClass} · {course.duration || 'Flexible duration'}</p>

              <div className="flex items-center justify-center gap-1 mb-5">
                {[1,2,3,4,5].map(n => <Star key={n} size={14} className="text-brand-amber fill-brand-amber" />)}
                <span className="text-slate-400 text-xs ml-1">Excellent</span>
              </div>

              <a href="#enroll-form-course" className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold w-full mb-3 transition-all ${accent.color === 'text-brand-amber' ? 'bg-brand-amber text-white hover:bg-amber-500' : 'bg-brand-green text-white hover:bg-green-500'}`}>
                <Calendar size={16} />
                Enroll Now
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-green-500/40 text-green-400 font-semibold rounded-xl hover:bg-green-600/10 transition-all text-sm w-full">
                <MessageCircle size={15} />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>

        {/* Enroll Form */}
        <div id="enroll-form-course" className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Interested in {course.title}? Enroll Now
          </h2>
          <DemoFormClient lang={lang} />
        </div>
      </div>
    </div>
  );
}
