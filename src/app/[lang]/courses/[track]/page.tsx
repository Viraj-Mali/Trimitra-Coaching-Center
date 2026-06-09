import { prisma } from '@/lib/prisma';
import DemoFormClient from '@/components/DemoFormClient';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Users, ChevronDown, MessageCircle, Star, Target, Calendar, FileText, HelpCircle, ShieldCheck, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

interface Props { params: { lang: string; track: string } }

function slugToTrack(slug: string): string {
  const map: Record<string, string> = {
    'foundation-6-to-9': 'FOUNDATION_6_9',
    'foundation_6_9': 'FOUNDATION_6_9',
    '10th-board': 'BOARD_10',
    'board_10': 'BOARD_10',
    '11-12-science': 'SCIENCE_11_12',
    'science_11_12': 'SCIENCE_11_12',
    'jee-neet': 'COMPETITIVE',
    'jee': 'COMPETITIVE_JEE',
    'competitive_jee': 'COMPETITIVE_JEE',
    'neet': 'COMPETITIVE_NEET',
    'competitive_neet': 'COMPETITIVE_NEET',
    'competitive': 'COMPETITIVE',
    'mht-cet': 'COMPETITIVE_MHTCET',
    'competitive_mhtcet': 'COMPETITIVE_MHTCET',
    'nata': 'COMPETITIVE_NATA',
    'competitive_nata': 'COMPETITIVE_NATA',
  };
  return map[slug] || slug.toUpperCase().replace(/-/g, '_');
}

const TRACK_ACCENT: Record<string, { color: string; border: string; icon: string }> = {
  FOUNDATION_6_9: { color: 'text-purple-400', border: 'border-purple-500/40', icon: '📚' },
  BOARD_10: { color: 'text-blue-400', border: 'border-blue-500/40', icon: '🎯' },
  SCIENCE_11_12: { color: 'text-brand-green', border: 'border-brand-green/40', icon: '🔬' },
  COMPETITIVE: { color: 'text-brand-amber', border: 'border-brand-amber/40', icon: '🏆' },
  COMPETITIVE_JEE: { color: 'text-brand-amber', border: 'border-brand-amber/40', icon: '🏆' },
  COMPETITIVE_NEET: { color: 'text-rose-400', border: 'border-rose-500/40', icon: '⚕️' },
  COMPETITIVE_MHTCET: { color: 'text-teal-400', border: 'border-teal-500/40', icon: '⚡' },
  COMPETITIVE_NATA: { color: 'text-red-400', border: 'border-red-500/40', icon: '📐' },
};

const STATIC_COURSES: Record<string, any> = {
  FOUNDATION_6_9: {
    title: 'Foundation Program',
    subtitle: 'Class 6th–9th',
    description: 'Strong foundation in Maths and Science with concept clarity, regular practice, and doubt-solving.',
    subjects: ['Maths', 'Science'],
    targetTrack: 'FOUNDATION_6_9',
    whoShouldJoin: 'This course is for Class 6th–9th students who want to build strong basics in Maths and Science, improve school performance, and prepare early for future board and competitive exam learning.',
    syllabusOverview: {
      note: 'Updated as per latest available official board/exam authority syllabus guidelines for 2026–27. Final syllabus and exam pattern may change as per official notifications.',
      references: ['Maharashtra State Board / MSBSHSE'],
      benefit: 'Students will build strong Maths and Science basics for school exams and future board preparation.',
      sections: [
        { name: 'Maths Overview', items: ['Number system', 'Algebra basics', 'Geometry basics', 'Mensuration', 'Data handling', 'Problem-solving practice'] },
        { name: 'Science Overview', items: ['Physics basics', 'Chemistry basics', 'Biology basics', 'Scientific thinking', 'Practical understanding', 'Concept clarity'] }
      ]
    },
    teachingMethod: 'Our teaching method focuses on concept clarity first, then regular practice, testing, revision, and parent communication.',
    teachingSteps: ['Concept Explanation', 'Classroom Practice', 'Homework / Worksheets', 'Weekly Test', 'Doubt Solving', 'Revision Planning', 'Parent Progress Update'],
    weeklyTestPlan: 'Students are tested regularly so they can understand their weak areas early. Test performance helps us plan revision, doubt-solving, and parent updates.',
    testPoints: ['Chapter-wise test', 'Weekly practice test', 'Revision test', 'Exam-style paper practice', 'Performance tracking', 'Weak area identification', 'Parent update after important tests'],
    whatYouGet: ['Classroom coaching', 'Concept explanation', 'Chapter-wise practice', 'Weekly tests', 'Doubt-solving sessions', 'Revision planning', 'Parent progress updates', 'Exam strategy guidance'],
    batchDetails: {
      classLevel: '6th–9th',
      subjects: 'Maths, Science',
      mode: 'Offline classroom',
      batchType: 'Regular academic batch',
      batchSize: 'Max 20 students per batch',
      duration: 'Academic year / Regular batch',
      language: 'English and Marathi explanations supported',
      timing: 'Contact for current batch timing'
    },
    faqs: [
      { q: 'Is this course suitable for weak students?', a: 'Yes. The course focuses on building Maths and Science basics through concept explanation, practice, and doubt-solving.' },
      { q: 'Which subjects are covered?', a: 'Maths and Science only.' },
      { q: 'Will this help in future board preparation?', a: 'Yes. Strong basics in Maths and Science help students prepare better for higher classes and board exams.' },
      { q: 'Are weekly tests included?', a: 'Yes. Regular tests are planned to track progress and identify weak areas.' }
    ]
  },
  BOARD_10: {
    title: '9th–10th Board Mastery',
    subtitle: 'SSC Board Preparation',
    description: 'Focused Maths and Science preparation for board exams with weekly tests, revision, and exam-style practice.',
    subjects: ['Maths', 'Science'],
    targetTrack: 'BOARD_10',
    whoShouldJoin: 'This course is for SSC students who need focused preparation in Maths and Science, regular tests, revision support, and board exam writing practice.',
    syllabusOverview: {
      note: 'Updated as per latest available official board/exam authority syllabus guidelines for 2026–27. Final syllabus and exam pattern may change as per official notifications.',
      references: ['Maharashtra State Board / MSBSHSE'],
      benefit: 'Students will prepare for Maths and Science board exams through chapter-wise learning, weekly tests, revision, and exam-style practice.',
      sections: [
        { name: 'Maths Overview', items: ['Algebra', 'Geometry', 'Trigonometry basics', 'Statistics', 'Mensuration', 'Board-style problem solving'] },
        { name: 'Science Overview', items: ['Physics concepts', 'Chemistry concepts', 'Biology concepts', 'Diagrams and definitions', 'Numericals', 'Board answer-writing practice'] }
      ]
    },
    teachingMethod: 'Our teaching method focuses on concept clarity first, then regular practice, testing, revision, and parent communication.',
    teachingSteps: ['Concept Explanation', 'Classroom Practice', 'Homework / Worksheets', 'Weekly Test', 'Doubt Solving', 'Revision Planning', 'Parent Progress Update'],
    weeklyTestPlan: 'Students are tested regularly so they can understand their weak areas early. Test performance helps us plan revision, doubt-solving, and parent updates. Special focus on board-style answer writing.',
    testPoints: ['Chapter-wise test', 'Weekly practice test', 'Revision test', 'Exam-style paper practice', 'Performance tracking', 'Weak area identification', 'Parent update after important tests'],
    whatYouGet: ['Classroom coaching', 'Concept explanation', 'Chapter-wise practice', 'Weekly tests', 'Doubt-solving sessions', 'Revision planning', 'Parent progress updates', 'Exam strategy guidance', 'Printed worksheets'],
    batchDetails: {
      classLevel: '9th–10th',
      subjects: 'Maths, Science',
      mode: 'Offline classroom',
      batchType: 'Regular academic batch',
      batchSize: 'Max 20 students per batch',
      duration: 'Academic year / Regular batch',
      language: 'English and Marathi explanations supported',
      timing: 'Contact for current batch timing'
    },
    faqs: [
      { q: 'Which subjects are covered?', a: 'Maths and Science only.' },
      { q: 'Is this course for SSC students?', a: 'Yes, this batch is exclusively for Maharashtra SSC Board students.' },
      { q: 'Are board-style tests conducted?', a: 'Yes. Students get chapter-wise and exam-style practice for Maths and Science.' },
      { q: 'Will students get revision support?', a: 'Yes. Revision planning and doubt-solving are part of the course.' }
    ]
  },
  SCIENCE_11_12: {
    title: '11th–12th Science',
    subtitle: 'PCMB Board & Entrance Foundation',
    description: 'Structured PCMB coaching for 11th–12th Science students with board and entrance-oriented preparation.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    targetTrack: 'SCIENCE_11_12',
    whoShouldJoin: 'This course is for Science stream students who need structured PCMB guidance for board exams and entrance exam foundation.',
    syllabusOverview: {
      note: 'Updated as per latest available official board/exam authority syllabus guidelines for 2026–27. Final syllabus and exam pattern may change as per official notifications.',
      references: ['Maharashtra State Board / MSBSHSE'],
      benefit: 'Students will get structured PCMB preparation for board exams and entrance exam foundation.',
      sections: [
        { name: 'Physics Overview', items: ['Mechanics', 'Electricity', 'Magnetism', 'Optics', 'Modern physics basics', 'Numericals'] },
        { name: 'Chemistry Overview', items: ['Physical chemistry', 'Organic chemistry', 'Inorganic chemistry', 'Reactions', 'Formula-based practice'] },
        { name: 'Mathematics Overview', items: ['Algebra', 'Trigonometry', 'Calculus', 'Coordinate geometry', 'Vectors', 'Probability'] },
        { name: 'Biology Overview', items: ['Cell biology', 'Human physiology', 'Genetics', 'Ecology', 'Plant and animal systems'] }
      ]
    },
    teachingMethod: 'Our teaching method focuses on concept clarity first, then regular practice, testing, revision, and parent communication.',
    teachingSteps: ['Concept Explanation', 'Classroom Practice', 'Homework / Worksheets', 'Weekly Test', 'Doubt Solving', 'Revision Planning', 'Parent Progress Update'],
    weeklyTestPlan: 'Students are tested regularly so they can understand their weak areas early. Test performance helps us plan revision, doubt-solving, and parent updates. Focuses on board and entrance-oriented practice.',
    testPoints: ['Chapter-wise test', 'Weekly practice test', 'Revision test', 'Exam-style paper practice', 'Performance tracking', 'Weak area identification', 'Parent update after important tests'],
    whatYouGet: ['Classroom coaching', 'Concept explanation', 'Chapter-wise practice', 'Weekly tests', 'Doubt-solving sessions', 'Revision planning', 'Parent progress updates', 'Exam strategy guidance', 'Printed worksheets'],
    batchDetails: {
      classLevel: '11th–12th Science',
      subjects: 'PCMB',
      mode: 'Offline classroom',
      batchType: 'Regular academic batch',
      batchSize: 'Max 20 students per batch',
      duration: 'Academic year / Regular batch',
      language: 'English and Marathi explanations supported',
      timing: 'Contact for current batch timing'
    },
    faqs: [
      { q: 'Is PCMB covered?', a: 'Yes. Physics, Chemistry, Mathematics, and Biology are covered.' },
      { q: 'Is this useful for board exams?', a: 'Yes. The course supports board preparation with regular practice and revision.' },
      { q: 'Is entrance foundation included?', a: 'Entrance-oriented practice can be included based on the student\'s goal.' },
      { q: 'Are weekly tests included?', a: 'Yes. Weekly tests help track progress and improve preparation.' }
    ]
  },
  COMPETITIVE_JEE: {
    title: 'JEE Preparation',
    subtitle: 'Engineering Entrance Exam Preparation',
    description: 'Focused preparation for Physics, Chemistry, and Mathematics based on the student\'s engineering exam goal.',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    targetTrack: 'COMPETITIVE_JEE',
    whoShouldJoin: 'This course is for students preparing for engineering entrance exams with subject-wise preparation in PCM.',
    note: 'JEE / MHT-CET PCM students focus on Physics, Chemistry, Mathematics.',
    syllabusOverview: {
      note: 'Updated as per latest available official board/exam authority syllabus guidelines for 2026–27. Final syllabus and exam pattern may change as per official notifications.',
      references: ['NTA JEE Main', 'Maharashtra State CET Cell', 'Maharashtra State Board / MSBSHSE'],
      benefit: 'Students will prepare subject-wise according to their exam goal: engineering.',
      sections: [
        { name: 'JEE / MHT-CET PCM', items: ['Physics', 'Chemistry', 'Mathematics', 'Numericals', 'MCQ practice', 'Time management', 'Previous-year question practice'] }
      ]
    },
    teachingMethod: 'Our teaching method focuses on concept clarity first, then regular practice, testing, revision, and parent communication.',
    teachingSteps: ['Concept Explanation', 'Classroom Practice', 'Homework / Worksheets', 'Weekly Test', 'Doubt Solving', 'Revision Planning', 'Parent Progress Update'],
    weeklyTestPlan: 'Students are tested regularly so they can understand their weak areas early. Test performance helps us plan revision, doubt-solving, and parent updates. Heavy emphasis on MCQ practice, speed, accuracy, and time management.',
    testPoints: ['Chapter-wise test', 'Weekly practice test', 'Revision test', 'Exam-style paper practice', 'Performance tracking', 'Weak area identification', 'Parent update after important tests'],
    whatYouGet: ['Classroom coaching', 'Concept explanation', 'Chapter-wise practice', 'Weekly tests', 'Doubt-solving sessions', 'Revision planning', 'Parent progress updates', 'Exam strategy guidance', 'Printed worksheets'],
    batchDetails: {
      classLevel: '11th–12th & Droppers',
      subjects: 'PCM',
      mode: 'Offline classroom',
      batchType: 'Regular academic batch',
      batchSize: 'Max 20 students per batch',
      duration: 'Academic year / Regular batch',
      language: 'English and Marathi explanations supported',
      timing: 'Contact for current batch timing'
    },
    faqs: [
      { q: 'Is this course for JEE and MHT-CET?', a: 'Yes. Preparation is guided according to the student\'s exam goal in engineering.' },
      { q: 'Is PCM handled separately?', a: 'Yes. JEE/MHT-CET PCM focuses strictly on Physics, Chemistry, and Mathematics.' },
      { q: 'Are regular tests conducted?', a: 'Yes. Regular MCQ practice, chapter tests, and exam-style practice are included.' },
      { q: 'Is doubt-solving available?', a: 'Yes. Doubt-solving support is part of the preparation system.' }
    ]
  },
  COMPETITIVE_NEET: {
    title: 'NEET UG Preparation',
    subtitle: 'Medical Entrance Exam Preparation',
    description: 'Focused preparation for Physics, Chemistry, and Biology based on the student\'s medical exam goal.',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    targetTrack: 'COMPETITIVE_NEET',
    whoShouldJoin: 'This course is for students preparing for medical entrance exams with subject-wise preparation in PCB.',
    note: 'NEET / MHT-CET PCB students focus on Physics, Chemistry, Biology.',
    syllabusOverview: {
      note: 'Updated as per latest available official board/exam authority syllabus guidelines for 2026–27. Final syllabus and exam pattern may change as per official notifications.',
      references: ['NTA NEET / NMC', 'Maharashtra State CET Cell', 'Maharashtra State Board / MSBSHSE'],
      benefit: 'Students will prepare subject-wise according to their exam goal: medical/pharmacy.',
      sections: [
        { name: 'NEET / MHT-CET PCB', items: ['Physics', 'Chemistry', 'Biology', 'NCERT-focused concepts', 'Diagrams', 'MCQ practice', 'Test strategy'] }
      ]
    },
    teachingMethod: 'Our teaching method focuses on concept clarity first, then regular practice, testing, revision, and parent communication.',
    teachingSteps: ['Concept Explanation', 'Classroom Practice', 'Homework / Worksheets', 'Weekly Test', 'Doubt Solving', 'Revision Planning', 'Parent Progress Update'],
    weeklyTestPlan: 'Students are tested regularly so they can understand their weak areas early. Test performance helps us plan revision, doubt-solving, and parent updates. Heavy emphasis on MCQ practice, speed, accuracy, and time management.',
    testPoints: ['Chapter-wise test', 'Weekly practice test', 'Revision test', 'Exam-style paper practice', 'Performance tracking', 'Weak area identification', 'Parent update after important tests'],
    whatYouGet: ['Classroom coaching', 'Concept explanation', 'Chapter-wise practice', 'Weekly tests', 'Doubt-solving sessions', 'Revision planning', 'Parent progress updates', 'Exam strategy guidance', 'Printed worksheets'],
    batchDetails: {
      classLevel: '11th–12th & Droppers',
      subjects: 'PCB',
      mode: 'Offline classroom',
      batchType: 'Regular academic batch',
      batchSize: 'Max 20 students per batch',
      duration: 'Academic year / Regular batch',
      language: 'English and Marathi explanations supported',
      timing: 'Contact for current batch timing'
    },
    faqs: [
      { q: 'Is this course for NEET and MHT-CET?', a: 'Yes. Preparation is guided according to the student\'s exam goal in medical or pharmacy.' },
      { q: 'Is PCB handled separately?', a: 'Yes. NEET/MHT-CET PCB focuses strictly on Physics, Chemistry, and Biology.' },
      { q: 'Are regular tests conducted?', a: 'Yes. Regular MCQ practice, chapter tests, and exam-style practice are included.' },
      { q: 'Is doubt-solving available?', a: 'Yes. Doubt-solving support is part of the preparation system.' }
    ]
  },
  COMPETITIVE_MHTCET: {
    title: 'MHT-CET Preparation',
    subtitle: 'Entrance Exam Preparation',
    description: 'Focused preparation for Physics, Chemistry, Mathematics, and Biology based on the student\'s exam goal.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    targetTrack: 'COMPETITIVE_MHTCET',
    whoShouldJoin: 'This course is for students preparing for engineering, medical, or CET entrance exams with subject-wise preparation in PCM or PCB based on their target exam.',
    note: 'JEE / MHT-CET PCM students focus on Physics, Chemistry, Mathematics. NEET / MHT-CET PCB students focus on Physics, Chemistry, Biology.',
    syllabusOverview: {
      note: 'Updated as per latest available official board/exam authority syllabus guidelines for 2026–27. Final syllabus and exam pattern may change as per official notifications.',
      references: ['Maharashtra State CET Cell', 'Maharashtra State Board / MSBSHSE'],
      benefit: 'Students will prepare subject-wise according to their exam goal: engineering or pharmacy.',
      sections: [
        { name: 'MHT-CET PCM', items: ['Physics', 'Chemistry', 'Mathematics', 'Numericals', 'MCQ practice', 'Time management', 'Previous-year question practice'] },
        { name: 'MHT-CET PCB', items: ['Physics', 'Chemistry', 'Biology', 'NCERT-focused concepts', 'Diagrams', 'MCQ practice', 'Test strategy'] }
      ]
    },
    teachingMethod: 'Our teaching method focuses on concept clarity first, then regular practice, testing, revision, and parent communication.',
    teachingSteps: ['Concept Explanation', 'Classroom Practice', 'Homework / Worksheets', 'Weekly Test', 'Doubt Solving', 'Revision Planning', 'Parent Progress Update'],
    weeklyTestPlan: 'Students are tested regularly so they can understand their weak areas early. Test performance helps us plan revision, doubt-solving, and parent updates. Heavy emphasis on MCQ practice, speed, accuracy, and time management.',
    testPoints: ['Chapter-wise test', 'Weekly practice test', 'Revision test', 'Exam-style paper practice', 'Performance tracking', 'Weak area identification', 'Parent update after important tests'],
    whatYouGet: ['Classroom coaching', 'Concept explanation', 'Chapter-wise practice', 'Weekly tests', 'Doubt-solving sessions', 'Revision planning', 'Parent progress updates', 'Exam strategy guidance', 'Printed worksheets'],
    batchDetails: {
      classLevel: '11th–12th & Droppers',
      subjects: 'PCM / PCB based on goal',
      mode: 'Offline classroom',
      batchType: 'Regular academic batch',
      batchSize: 'Max 20 students per batch',
      duration: 'Academic year / Regular batch',
      language: 'English and Marathi explanations supported',
      timing: 'Contact for current batch timing'
    },
    faqs: [
      { q: 'Is this course for MHT-CET?', a: 'Yes. Preparation is guided according to the student\'s exam goal.' },
      { q: 'Is PCM and PCB handled separately?', a: 'Yes. MHT-CET PCM focuses on Physics, Chemistry, and Mathematics. MHT-CET PCB focuses on Physics, Chemistry, and Biology.' },
      { q: 'Are regular tests conducted?', a: 'Yes. Regular MCQ practice, chapter tests, and exam-style practice are included.' },
      { q: 'Is doubt-solving available?', a: 'Yes. Doubt-solving support is part of the preparation system.' }
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = params;
  const targetTrack = slugToTrack(track);
  try {
    const dbCourse = await prisma.course.findFirst({ where: { OR: [{ slug: track }, { targetTrack }] } });
    const course = STATIC_COURSES[targetTrack];
    const title = dbCourse?.metaTitle || course?.title || 'Course';
    return {
      title: `${title} | Trimitra Coaching Centre, Talegaon Dighe`,
      description: dbCourse?.metaDescription || course?.description || `Expert coaching for ${title} in Talegaon Dighe near Sangamner. Small batches, personal attention, structured preparation.`,
      keywords: `${title} coaching near Sangamner, tuition Talegaon Dighe, best coaching classes near Sangamner`,
      openGraph: {
        title: `${title} Coaching | Trimitra`,
        description: `Expert coaching for ${title}. Enroll now at Trimitra Coaching Centre.`,
      },
    };
  } catch (e) {
    return {
      title: 'Course | Trimitra Coaching Centre',
      description: 'Expert coaching in Talegaon Dighe near Sangamner.',
    };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { lang, track } = params;
  const targetTrack = slugToTrack(track);

  let settings: any = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch (e) {}

  const course = STATIC_COURSES[targetTrack] || STATIC_COURSES.COMPETITIVE_JEE; // Fallback
  const whatsapp = settings?.whatsapp || '9665269059';
  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20for%20${encodeURIComponent(course.title)}%20at%20Trimitra%20Coaching%20Centre.`;
  const accent = TRACK_ACCENT[targetTrack] || TRACK_ACCENT.COMPETITIVE;

  const getSyllabusJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': course.title,
      'description': course.description,
      'provider': {
        '@type': 'EducationalOrganization',
        'name': 'Trimitra Coaching Centre',
        'sameAs': 'https://trimitracoaching.com'
      }
    };
  };

  const getFaqJsonLd = () => {
    if (!course.faqs || course.faqs.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': course.faqs.map((faq: any) => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a
        }
      }))
    };
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSyllabusJsonLd()) }} />
      {getFaqJsonLd() && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd()) }} />}
      <div className="max-w-6xl mx-auto">
        <Link href={`/${lang}#courses`} className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-green mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to All Courses
        </Link>

        {/* ── 1. Hero Section ─────────────────────────────────────────────────────── */}
        <div className={`glass-card border-2 ${accent.border} p-8 mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-3 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-5xl shrink-0">{accent.icon}</div>
              <div className="flex-1">
                <p className={`text-sm font-semibold mb-1 ${accent.color}`}>{course.subtitle}</p>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{course.title}</h1>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4 max-w-2xl">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.subjects.map((s: string) => (
                    <span key={s} className="badge bg-white/10 text-slate-300 border-white/20 text-xs px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-green" /> Small Batch</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-green" /> Weekly Test</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-green" /> Doubt Solving</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-green" /> Parent Updates</span>
                </div>
                {course.note && <p className="text-brand-amber text-xs italic mt-2">{course.note}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* 2. Who Is This Course For? */}
            <div className="glass-card p-6 border border-white/5">
              <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                <Users size={18} className={accent.color} /> Who Is This Course For?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">{course.whoShouldJoin}</p>
            </div>

            {/* 3. Subjects Covered */}
            <div className="glass-card p-6 border border-white/5 hidden lg:block">
               <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <BookOpen size={18} className={accent.color} /> Subjects Covered
              </h2>
              <div className="grid grid-cols-2 gap-3">
                 {course.subjects.map((subject: string) => (
                   <div key={subject} className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                      <CheckCircle size={14} className="text-brand-green" /> {subject}
                   </div>
                 ))}
              </div>
            </div>

            {/* 4. Latest Syllabus Overview for Students */}
            <div className="glass-card p-6 border border-white/5">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <FileText size={18} className={accent.color} /> Latest Syllabus Overview
              </h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-5">
                <p className="text-xs text-blue-200">{course.syllabusOverview.note}</p>
              </div>
              
              <div className="space-y-4 mb-5">
                {course.syllabusOverview.sections.map((section: any, idx: number) => (
                   <div key={idx} className="bg-white/5 rounded-xl p-4">
                     <h3 className="text-white font-semibold text-sm mb-3">{section.name}</h3>
                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {section.items.map((item: string, j: number) => (
                         <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                ))}
              </div>
              <div className="text-xs text-slate-400 mb-3">
                <strong className="text-slate-300">Official syllabus references:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {course.syllabusOverview.references.map((ref: string) => <li key={ref}>{ref}</li>)}
                </ul>
              </div>
              <p className="text-sm text-brand-green font-medium">Student Benefit: <span className="text-slate-300 font-normal">{course.syllabusOverview.benefit}</span></p>
            </div>

            {/* 5. Teaching Method */}
            <div className="glass-card p-6 border border-white/5">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Target size={18} className={accent.color} /> Our Teaching Method
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{course.teachingMethod}</p>
              <div className="relative border-l border-white/10 ml-3 space-y-4">
                {course.teachingSteps.map((step: string, idx: number) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(22,163,74,0.8)]" />
                    <p className="text-sm font-medium text-white">{idx + 1}. {step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Weekly Test System */}
            <div className="glass-card p-6 border border-white/5">
              <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                <Calendar size={18} className={accent.color} /> Weekly Test System
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{course.weeklyTestPlan}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {course.testPoints.map((tp: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                    <CheckCircle size={14} className={accent.color} /> {tp}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. What Students Will Get */}
            <div className="glass-card p-6 border border-white/5">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Star size={18} className={accent.color} /> What Students Will Get
              </h2>
              <div className="flex flex-wrap gap-2">
                 {course.whatYouGet.map((item: string) => (
                   <span key={item} className="text-xs text-slate-300 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full">{item}</span>
                 ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 italic">Student dashboard features will be introduced phase-wise.</p>
            </div>

            {/* 9. First Batch Advantage */}
            <div className="glass-card p-6 border border-brand-green/20 bg-gradient-to-br from-brand-green/10 to-transparent">
              <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                <Star size={18} className="text-brand-green fill-brand-green" /> First Batch Advantage
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                As this is one of our initial batches, students receive more personal attention, close academic tracking, direct mentor support, and flexible doubt-solving.
              </p>
              <ul className="space-y-2">
                {['More personal attention', 'Smaller group focus', 'Direct mentor interaction', 'Flexible doubt-solving', 'Close academic tracking', 'Better parent communication', 'Strong foundation from the beginning'].map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                    <CheckCircle size={14} className="text-brand-green mt-0.5 shrink-0" /> {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* 10. Course FAQ */}
            <div className="glass-card p-6 border border-white/5">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <HelpCircle size={18} className={accent.color} /> Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {course.faqs.map((faq: any, idx: number) => (
                  <details key={idx} className="group border border-white/10 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-white/5 transition-colors">
                      <span className="text-white text-sm font-semibold pr-4">{faq.q}</span>
                      <ChevronDown size={16} className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar — 1/3 */}
          <div className="space-y-5">

            {/* 8. Batch Details */}
            <div className="glass-card p-6 border border-white/10 sticky top-6">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <Clock size={18} className={accent.color} /> Batch Details
              </h3>
              <div className="space-y-4 mb-6">
                 <div>
                   <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Class Level</span>
                   <p className="text-sm text-white font-medium">{course.batchDetails.classLevel}</p>
                 </div>
                 <div>
                   <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Subjects</span>
                   <p className="text-sm text-white font-medium">{course.batchDetails.subjects}</p>
                 </div>
                 <div>
                   <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Mode</span>
                   <p className="text-sm text-white font-medium">{course.batchDetails.mode}</p>
                 </div>
                 <div>
                   <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Batch Size</span>
                   <p className="text-sm text-brand-green font-medium">{course.batchDetails.batchSize}</p>
                 </div>
                 <div>
                   <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Timing</span>
                   <p className="text-sm text-brand-amber font-medium">{course.batchDetails.timing}</p>
                 </div>
              </div>
              
              <div className="pt-5 border-t border-white/10">
                 <h4 className="text-white text-sm font-bold mb-3 text-center">Want to know if this course is right for your child?</h4>
                 <div className="space-y-3">
                   <a href="#enroll-form-course" className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-green text-white hover:bg-green-500 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-green-500/30">
                     <Calendar size={16} /> Enroll Now
                   </a>
                   <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl text-sm font-bold transition-all">
                     <MessageCircle size={16} className="text-green-400" /> WhatsApp Us
                   </a>
                   <a href="tel:+919665269059" className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl text-sm font-bold transition-all">
                     <MapPin size={16} className="text-blue-400" /> Call Now
                   </a>
                 </div>
              </div>
            </div>
            
            {/* Mobile Subjects Fallback */}
            <div className="glass-card p-5 border border-white/5 lg:hidden">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <BookOpen size={16} className={accent.color} /> Subjects Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.subjects.map((s: string) => (
                  <span key={s} className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 11. Final CTA Section (Enroll Form) */}
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
