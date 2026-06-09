import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Users, Trophy, Clock, Star,
  Phone, Mail, MapPin, MessageCircle, ChevronRight,
  BookOpen, Target, BarChart3, Bell, Shield, Lightbulb,
  CalendarCheck, Award, TrendingUp, ChevronDown
} from 'lucide-react';
import DemoFormClient from '@/components/DemoFormClient';

interface Props { params: { lang: string } }

const COURSE_STYLES = [
  { icon: '📚', colorClass: 'border-purple-500/40 hover:border-purple-500/80', badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30', btnClass: 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30' },
  { icon: '🎯', colorClass: 'border-blue-500/40 hover:border-blue-500/80', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30', btnClass: 'bg-blue-500/20 border-blue-500/40 text-blue-300 hover:bg-blue-500/30' },
  { icon: '🔬', colorClass: 'border-brand-green/40 hover:border-brand-green/80', badgeClass: 'bg-brand-green/15 text-brand-green border-brand-green/30', btnClass: 'bg-brand-green/20 border-brand-green/40 text-brand-green hover:bg-brand-green/30' },
  { icon: '🏆', colorClass: 'border-brand-amber/40 hover:border-brand-amber/80', badgeClass: 'bg-brand-amber/15 text-brand-amber border-brand-amber/30', btnClass: 'bg-brand-amber/20 border-brand-amber/40 text-brand-amber hover:bg-brand-amber/30' },
  { icon: '⚡', colorClass: 'border-teal-500/40 hover:border-teal-500/80', badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30', btnClass: 'bg-teal-500/20 border-teal-500/40 text-teal-300 hover:bg-teal-500/30' },
  { icon: '📐', colorClass: 'border-red-500/40 hover:border-red-500/80', badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30', btnClass: 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30' },
];

const WHY_FEATURES = [
  { icon: Shield, title: { en: 'Qualified Mentor', mr: 'पात्र मार्गदर्शक' }, desc: { en: 'Expert guidance by a physics and mathematics specialist, ensuring top-tier conceptual clarity.', mr: 'भौतिकशास्त्र आणि गणित तज्ञांचे मार्गदर्शन, संकल्पना स्पष्टतेची खात्री.' } },
  { icon: Users, title: { en: 'Small Focus Batches', mr: 'लहान बॅच' }, desc: { en: 'Max 15–20 students per batch so every student gets personal attention and is never left behind.', mr: 'प्रत्येक विद्यार्थ्याला वैयक्तिक लक्ष मिळावे म्हणून जास्तीत जास्त १५-२० विद्यार्थी.' } },
  { icon: Target, title: { en: 'Regular Weekly Tests', mr: 'साप्ताहिक चाचण्या' }, desc: { en: 'Strict schedule of chapter-wise and full-syllabus tests to constantly track and improve performance.', mr: 'कामगिरी सुधारण्यासाठी अध्याय-निहाय आणि संपूर्ण अभ्यासक्रम चाचण्या.' } },
  { icon: Lightbulb, title: { en: 'Doubt-Solving Sessions', mr: 'शंका-निराकरण' }, desc: { en: 'Dedicated time after every class ensuring no question goes unanswered.', mr: 'प्रत्येक वर्गानंतर समर्पित शंका-निराकरण सत्रे.' } },
  { icon: Bell, title: { en: 'Parent Updates', mr: 'पालकांना अपडेट' }, desc: { en: 'Transparent communication with parents through monthly reports and direct interactions.', mr: 'मासिक अहवाल आणि थेट संवादातून पालकांशी पारदर्शक संवाद.' } },
  { icon: BookOpen, title: { en: 'Concept-First Teaching', mr: 'संकल्पना-प्रथम शिक्षण' }, desc: { en: 'We prioritize deep understanding over rote memorization. Concepts first, formulas follow.', mr: 'आम्ही पाठांतरापेक्षा समजण्याला प्राधान्य देतो.' } },
  { icon: Target, title: { en: 'Board + Competitive', mr: 'बोर्ड आणि स्पर्धा परीक्षा' }, desc: { en: 'Seamlessly balanced approach for both board exams and entrance tests (JEE/NEET/MHT-CET).', mr: 'बोर्ड परीक्षा आणि स्पर्धा परीक्षांसाठी संतुलित दृष्टिकोन.' } },
  { icon: CalendarCheck, title: { en: 'Structured Syllabus', mr: 'संरचित अभ्यासक्रम' }, desc: { en: 'A clear roadmap ensuring timely completion and ample revision time before final exams.', mr: 'वेळेवर पूर्ण होणारा आणि उजळणीसाठी वेळ देणारा अभ्यासक्रम.' } },
];



export default async function HomePage({ params }: Props) {
  const { lang } = params;
  const student = await getCurrentStudent();

  // Load everything from database
  let dbCourses: any[] = [];
  let settings: any = null;
  let dbFAQs: any[] = [];
  let dbGallery: any[] = [];

  try {
    const [fetchedCourses, fetchedSettings, fetchedFAQs, fetchedGallery] = await Promise.all([
      prisma.course.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
      prisma.fAQ.findMany({ where: { isActive: true, courseId: null }, orderBy: { sortOrder: 'asc' }, take: 6 }),
      prisma.gallery.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 6 }),
    ]);
    dbCourses = fetchedCourses;
    settings = fetchedSettings;
    dbFAQs = fetchedFAQs;
    dbGallery = fetchedGallery;
  } catch (e) {
    console.error('Failed to fetch data from database, using fallback content:', e);
  }

  const whatsapp = settings?.whatsapp || '9665269059';
  const phone = settings?.phone || '9665269059';
  const email = settings?.email || 'info@trimitra.in';
  const address = settings?.address || '2nd Floor, Society Complex, Talegaon Dighe, Tal. Sangamner, Dist. Ahmednagar, Maharashtra';
  const mapsLink = settings?.mapsLink || 'https://maps.google.com/?q=Talegaon+Dighe+Sangamner';
  const heroHeadline = settings?.heroHeadline || 'Personal Coaching for Class 6th to 12th, Board Exams & Competitive Exams';
  const heroSub = settings?.heroSubheadline || 'Focused mentorship, small batches, regular tests, doubt-solving sessions, and progress tracking under the expert guidance of Dr. Sarthak Dighe.';

  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20at%20Trimitra%20Coaching%20Centre.`;

  const l = (obj: { en: string; mr: string }) => obj[lang as 'en' | 'mr'] || obj.en;

  return (
    <>
      {/* ── WhatsApp Floating Button ─────────────────────────────── */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-2xl px-4 py-3 shadow-2xl shadow-green-500/40 transition-all hover:scale-105 group"
        title="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-sm hidden sm:inline">WhatsApp Us</span>
      </a>

      {/* FAQ Schema */}
      {dbFAQs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: dbFAQs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* ── 1. HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0F2E5A] to-[#071020]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-amber/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/15 border border-brand-green/30 rounded-full text-brand-green text-sm font-semibold mb-6">
                <Star size={14} fill="currentColor" />
                {lang === 'mr' ? 'महाराष्ट्रातील विश्वासू शिकवणी केंद्र' : "Talegaon Dighe's Trusted Coaching Centre"}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-black text-white leading-[1.1] mb-5">
                {lang === 'mr' ? (
                  <>इयत्ता <span className="text-brand-green">६वी ते १२वी</span>, बोर्ड परीक्षा<br />आणि स्पर्धा परीक्षांसाठी<br /><span className="text-brand-amber">वैयक्तिक कोचिंग</span></>
                ) : (
                  <>{heroHeadline.split(',').slice(0, 1)}<span className="text-brand-green"></span><br />
                  <span className="text-brand-amber">{heroHeadline.split(',').slice(1).join(',')}</span></>
                )}
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                {lang === 'mr'
                  ? 'केंद्रित मार्गदर्शन, लहान बॅच, नियमित चाचण्या, शंका-निराकरण, आणि तज्ञ मार्गदर्शनाखाली प्रगती ट्रॅकिंग.'
                  : heroSub}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <a href="#enroll-form" className="flex items-center gap-2 px-5 py-3 bg-brand-amber hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 hover:scale-105">
                  <CalendarCheck size={18} />
                  {lang === 'mr' ? 'प्रवेश नोंदणी' : 'Enroll Now'}
                </a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <a href={`tel:+91${phone}`} className="flex items-center gap-2 px-5 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-xl transition-all">
                  <Phone size={18} />
                  Call Now
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: '≤20', label: { en: 'Students/Batch', mr: 'विद्यार्थी/बॅच' } },
                  { value: '1-on-1', label: { en: 'Personal Attention', mr: 'वैयक्तिक लक्ष' } },
                  { value: 'Weekly', label: { en: 'Pattern Tests', mr: 'साप्ताहिक चाचण्या' } },
                  { value: 'Concept', label: { en: 'First Approach', mr: 'संकल्पना-प्रथम' } },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-brand-amber">{s.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{l(s.label)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/hero-classroom.jpg"
                  alt="Dr. Sarthak Dighe teaching students at Trimitra Coaching Centre, Talegaon Dighe"
                  width={600}
                  height={420}
                  className="object-cover w-full h-[420px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E5A]/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-4 -left-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-brand-green/15 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">Concept Focus</p>
                  <p className="text-slate-500 text-xs">For Deep Understanding</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-brand-amber/15 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-brand-amber" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">Small Batches</p>
                  <p className="text-slate-500 text-xs">Max 15–20 Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW: FIRST BATCH ADVANTAGE ──────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-green/10 border-y border-brand-green/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/20 border border-brand-green/40 rounded-full text-brand-green text-sm font-bold mb-6">
            <Star size={16} fill="currentColor" />
            {lang === 'mr' ? 'नवीन बॅचचे फायदे' : 'The First Batch Advantage'}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {lang === 'mr' ? 'सुरुवातीपासूनच भक्कम पाया' : 'Turn Our Fresh Start Into Your Strength'}
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            {lang === 'mr'
              ? 'नवीन केंद्र असल्याने, आम्ही प्रत्येक विद्यार्थ्यावर लक्ष केंद्रित करू शकतो. कमी विद्यार्थी, अधिक लक्ष आणि दररोज थेट मार्गदर्शकाचा संवाद.'
              : 'As a newly opened center, we offer what massive institutes cannot: absolute focus. With limited seats, smaller batches, and direct daily interaction with the founder, your child gets the undivided attention they deserve to build a solid academic foundation.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left relative z-10">
            {[
              { icon: Users, title: 'Smaller Batches', desc: 'More time per student.' },
              { icon: Target, title: 'Direct Mentorship', desc: 'Daily interaction with Dr. Dighe.' },
              { icon: Shield, title: 'No Crowds', desc: 'A focused, distraction-free environment.' }
            ].map((adv, i) => {
              const Icon = adv.icon;
              return (
              <div key={i} className="relative group bg-[#0F2E5A] border border-white/10 rounded-3xl p-8 hover:bg-[#13386e] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-amber/20 to-brand-green/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#091c38] border border-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Icon size={28} className="text-brand-amber group-hover:text-brand-green transition-colors duration-500" />
                  </div>
                  <h4 className="text-white font-bold text-xl mb-3">{adv.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{adv.desc}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ── 3.5. OUR STUDY SYSTEM ──────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091c38] to-[#0F2E5A]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-green text-sm font-semibold uppercase tracking-wider mb-2">
            {lang === 'mr' ? 'आमची अभ्यास प्रणाली' : 'Our Study System'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
            {lang === 'mr' ? 'यशाचा स्पष्ट मार्ग' : 'A Process-Based Academic Framework'}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-16 right-16 h-0.5 bg-gradient-to-r from-transparent via-brand-green/30 to-transparent"></div>
            
            {[
              { step: '01', title: 'Chapter-Wise Teaching', desc: 'Structured syllabus coverage with deep concept explanation.', icon: BookOpen },
              { step: '02', title: 'Rigorous Practice', desc: 'Daily assignments and doubt-solving sessions.', icon: Lightbulb },
              { step: '03', title: 'Weekly Testing', desc: 'Pattern-based tests to measure understanding accurately.', icon: Target },
              { step: '04', title: 'Parent Updates', desc: 'Transparent progress tracking and exam-oriented revision.', icon: Trophy }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center group">
                  <div className="w-24 h-24 bg-[#0F2E5A] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group-hover:-translate-y-2 transition-all duration-500">
                    <div className="absolute -inset-2 bg-gradient-to-br from-brand-green to-brand-amber rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>
                    <div className="absolute inset-2 bg-[#091c38] rounded-full flex items-center justify-center border border-white/5">
                      <Icon size={32} className="text-white group-hover:text-brand-green transition-colors duration-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-wide"><span className="text-brand-green mr-2">{s.step}.</span>{s.title}</h3>
                  <p className="text-slate-400 text-sm max-w-[220px] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. COURSES ─────────────────────────────────────────────── */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091c38]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-green text-sm font-semibold uppercase tracking-wider mb-2">
              {lang === 'mr' ? 'आमचे कार्यक्रम' : 'Our Programs'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {lang === 'mr' ? 'तुमच्यासाठी योग्य अभ्यासक्रम' : 'Find the Right Course for You'}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {lang === 'mr'
                ? 'इयत्ता ६वी ते स्पर्धा परीक्षांपर्यंत — प्रत्येक टप्प्यासाठी संरचित शिक्षण कार्यक्रम.'
                : 'From Class 6th to competitive entrance exams — structured programs for every academic milestone.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(dbCourses.length > 0 ? dbCourses : [
              { id: 'f1', title: 'Foundation (6th-8th)', subtitle: 'Build Strong Basics', description: 'Perfect starting point for academic excellence and conceptual clarity.', subjects: 'Maths,Science', targetTrack: 'FOUNDATION_6_9' },
              { id: 'f2', title: '9th-10th Board Mastery', subtitle: 'Target 95%+', description: 'Comprehensive preparation for SSC & CBSE board exams.', subjects: 'Maths,Science', targetTrack: 'BOARD_10' },
              { id: 'f3', title: '11th-12th Science', subtitle: 'HSC / CBSE', description: 'Expert coaching for Board exams with practical insights.', subjects: 'Physics,Chemistry,Maths,Biology', targetTrack: 'SCIENCE_11_12' },
              { id: 'f4', title: 'JEE & NEET', subtitle: 'Competitive Focus', description: 'Rigorous preparation for top-tier engineering and medical colleges.', subjects: 'Physics,Chemistry,Maths,Biology', targetTrack: 'COMPETITIVE' },
              { id: 'f5', title: 'MHT-CET (PCMB)', subtitle: 'State Engineering', description: 'Focused training for Maharashtra state level engineering and pharmacy entrance.', subjects: 'Physics,Chemistry,Maths,Biology', targetTrack: 'COMPETITIVE_MHTCET' },
              { id: 'f6', title: 'NATA', subtitle: 'Architecture Entrance', description: 'Dedicated coaching for National Aptitude Test in Architecture.', subjects: 'Physics,Chemistry,Maths,Biology', targetTrack: 'COMPETITIVE_NATA' },
            ]).map((course: any, idx) => {
              const style = COURSE_STYLES[idx % COURSE_STYLES.length];
              const courseSlug = course.slug || course.targetTrack.toLowerCase();
              return (
                <div key={course.id} className={`group relative bg-[#0F2E5A] rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] p-8 flex flex-col overflow-hidden ${style.colorClass}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500 origin-left">{style.icon}</div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border mb-4 w-fit ${style.badgeClass}`}>
                      {course.subtitle || '—'}
                    </span>
                    <h3 className="text-white font-black text-xl mb-3">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">{course.description}</p>

                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded-md font-semibold">
                          <Clock size={12} className="inline mr-1" /> Weekly Tests
                        </span>
                        <span className="text-xs text-brand-amber bg-brand-amber/10 border border-brand-amber/20 px-2.5 py-1 rounded-md font-semibold">
                          <Target size={12} className="inline mr-1" /> Syllabus Focus
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                        {lang === 'mr' ? 'विषय' : 'Subjects'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.subjects.split(',').slice(0, 3).map((s: string) => (
                          <span key={s} className="text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">{s.trim()}</span>
                        ))}
                        {course.subjects.split(',').length > 3 && (
                          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">+{course.subjects.split(',').length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                      <a
                        href="#enroll-form"
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-green hover:bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-green/20 transition-all hover:scale-105"
                      >
                        {lang === 'mr' ? 'मोफत डेमो क्लास बूक करा' : 'Book Free Demo Class'}
                      </a>
                      <Link
                        href={`/${lang}/courses/${courseSlug}`}
                        className={`flex items-center justify-center gap-2 py-3 px-4 border rounded-xl text-sm font-bold transition-all ${style.btnClass}`}
                      >
                        {lang === 'mr' ? 'अभ्यासक्रम पहा' : 'View Details'}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. WHY TRIMITRA ──────────────────────────────────────────── */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-wider mb-2">
              {lang === 'mr' ? 'आमची ताकद' : 'Our Strength'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {lang === 'mr' ? 'पालक त्रिमित्रवर का विश्वास ठेवू शकतात?' : 'Why Parents Can Trust Trimitra'}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {lang === 'mr'
                ? 'आम्ही फक्त एक कोचिंग क्लास नाही — आम्ही विद्यार्थ्यांचे भविष्य घडवतो.'
                : "We're not just another coaching class — we build futures with personal attention and proven methods."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="relative group bg-[#0F2E5A] border border-white/5 rounded-3xl p-8 hover:bg-[#13386e] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-[#091c38] border border-brand-green/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:border-brand-green/40 transition-all duration-500">
                      <Icon size={26} className="text-brand-green" />
                    </div>
                    <h3 className="text-white font-bold mb-3 text-lg">{l(feat.title)}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{l(feat.desc)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. MENTOR SECTION ─────────────────────────────────────────── */}
      <section id="mentor" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091c38]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">

              {/* Photo Area */}
              <div className="md:col-span-2 bg-gradient-to-br from-brand-green/20 to-brand-blue/50 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-brand-green/40 mb-5 shadow-xl relative">
                  <Image
                    src={settings?.mentorImageUrl || "/mentor-sarthak.png"}
                    alt="Dr. Sarthak Dighe - Founder and Head Mentor at Trimitra Coaching Centre"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="text-white font-black text-xl mb-1">Dr. Sarthak Dighe</h3>
                <p className="text-brand-green font-semibold text-sm mb-3">Founder & Head Mentor</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['BAMS', 'Physics & Mathematics Specialist', 'JEE/NEET/NATA Mentor'].map(tag => (
                    <span key={tag} className="text-xs bg-brand-green/15 border border-brand-green/30 text-brand-green px-2.5 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="md:col-span-3 p-8 lg:p-10">
                <p className="text-sm text-brand-amber font-semibold uppercase tracking-wider mb-3">
                  {lang === 'mr' ? 'मार्गदर्शकाबद्दल' : 'About Your Mentor'}
                </p>
                <blockquote className="text-white text-lg lg:text-xl font-medium leading-relaxed mb-5 border-l-4 border-brand-green pl-5">
                  {lang === 'mr'
                    ? '"माझी दृष्टी नेहमीच अशी आहे की प्रत्येक विद्यार्थ्याला दिसेल, मार्गदर्शन मिळेल आणि आपले सर्वोत्तम साध्य करण्यासाठी सक्षम वाटेल."'
                    : '"My vision has always been to create an environment where every student feels seen, guided, and empowered to achieve their very best."'}
                </blockquote>

                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  {lang === 'mr'
                    ? 'डॉ. सार्थक दिघे हे BAMS पदवीधर आणि भौतिकशास्त्र व गणिताचे विशेषज्ञ आहेत. ते विज्ञान आणि गणित विषयातील क्लिष्ट संकल्पना सोप्या भाषेत समजावून सांगण्यासाठी समर्पित आहेत. विद्यार्थ्यांना थेट मार्गदर्शकाखाली संकल्पना-प्रथम शिक्षण, वैयक्तिक शंका-निराकरण आणि संरचित परीक्षा तयारी मिळते.'
                    : 'Students receive concept-first teaching, personal doubt-solving, and structured exam preparation under direct mentor guidance. Dr. Sarthak Dighe is a BAMS graduate and a dedicated Physics & Mathematics specialist passionate about simplifying complex concepts for board and competitive exams.'}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: { en: 'Specialization', mr: 'विशेषज्ञता' }, value: { en: 'Physics & Mathematics', mr: 'भौतिकशास्त्र आणि गणित' } },
                    { label: { en: 'Teaching Style', mr: 'शिकवण्याची पद्धत' }, value: { en: 'Concept-first, exam-focused', mr: 'संकल्पना-प्रथम, परीक्षा-केंद्रित' } },
                    { label: { en: 'Batch Strength', mr: 'बॅचची ताकद' }, value: { en: 'Max 15–20 students', mr: 'जास्तीत जास्त १५-२० विद्यार्थी' } },
                    { label: { en: 'Regular Testing', mr: 'नियमित चाचण्या' }, value: { en: 'Weekly Mock Series', mr: 'साप्ताहिक मॉक मालिका' } },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3">
                      <p className="text-slate-500 text-xs mb-1">{l(item.label)}</p>
                      <p className="text-white font-semibold text-sm">{l(item.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── 6. GALLERY ──────────────────────────────────────────────── */}
      {(dbGallery.length > 0 || true) && (
        <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091c38]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-brand-amber text-sm font-semibold uppercase tracking-wider mb-2">
                {lang === 'mr' ? 'आमची गॅलरी' : 'Gallery'}
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">
                {lang === 'mr' ? 'त्रिमित्रमध्ये एक नजर' : 'A Glimpse Into Trimitra'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(dbGallery.length > 0 ? dbGallery.slice(0, 6) : [
                { id: 'g1', imageUrl: '/hero-classroom.jpg', caption: 'Focused Classroom Environment', altText: 'Classroom teaching at Trimitra' },
                { id: 'g2', imageUrl: '/classroom_glimpse.png', caption: 'Personal Mentor Guidance', altText: 'Doubt Solving and Mentorship' },
                { id: 'g3', imageUrl: '/study_setup.png', caption: 'Quiet Study & Test Practice', altText: 'Test Practice Setup' }
              ]).map((item: any) => (
                <div key={item.id} className="relative h-56 rounded-2xl overflow-hidden border border-white/10 group">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText || item.caption || 'Trimitra Coaching Centre'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. ENROLL FORM ────────────────────────────────────────────── */}
      <section id="enroll-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left Info */}
            <div className="lg:col-span-2">
              <p className="text-brand-amber text-sm font-semibold uppercase tracking-wider mb-2">
                {lang === 'mr' ? 'प्रवेश प्रक्रिया' : 'Admissions Open'}
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">
                {lang === 'mr' ? 'प्रवेशासाठी नोंदणी करा' : 'Register / Enroll Now'}
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {lang === 'mr'
                  ? 'डॉ. सार्थक दिघे यांच्यासोबत एक तास घालवा. कोणताही दबाव नाही, फक्त शिकण्याचा अनुभव.'
                  : 'Spend an hour with Dr. Sarthak Dighe. No pressure, no commitment — just experience the Trimitra teaching difference firsthand.'}
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { en: 'Personalised evaluation of your current level', mr: 'तुमच्या सध्याच्या पातळीचे वैयक्तिक मूल्यांकन' },
                  { en: 'Course roadmap and target strategy', mr: 'अभ्यासक्रम रोडमॅप आणि लक्ष्य धोरण' },
                  { en: 'Meet Dr. Sarthak and experience his teaching style', mr: 'डॉ. सार्थक यांच्याशी भेट आणि शिकवण्याची पद्धत समजून घ्या' },
                  { en: 'No fee, no obligation whatsoever', mr: 'कोणतेही शुल्क नाही, कोणतेही बंधन नाही' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-brand-green shrink-0" />
                    <span className="text-slate-300 text-sm">{l(item)}</span>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                <p className="text-white font-bold mb-1">
                  {lang === 'mr' ? 'त्वरित संपर्क' : 'Reach Us Instantly'}
                </p>
                <p className="text-slate-400 text-sm mb-3">
                  {lang === 'mr' ? 'WhatsApp वर थेट संदेश पाठवा' : `WhatsApp: +91 ${whatsapp}`}
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  <MessageCircle size={18} />
                  {lang === 'mr' ? 'WhatsApp वर चॅट करा' : 'Chat on WhatsApp'}
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <DemoFormClient lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────────── */}
      {dbFAQs.length > 0 && (
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091c38]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-brand-green text-sm font-semibold uppercase tracking-wider mb-2">
                {lang === 'mr' ? 'प्रश्न उत्तरे' : 'Frequently Asked Questions'}
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">
                {lang === 'mr' ? 'तुमच्या प्रश्नांची उत्तरे' : 'Got Questions? We Have Answers.'}
              </h2>
            </div>
            <div className="space-y-3">
              {dbFAQs.map((faq) => (
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. CONTACT ──────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              {lang === 'mr' ? 'आमच्याशी संपर्क साधा' : 'Visit or Contact Us'}
            </h2>
            <p className="text-slate-400">
              {lang === 'mr' ? 'आम्ही तळेगाव दिघे, ता. संगमनेर येथे आहोत.' : "We're based in Talegaon Dighe, Tal. Sangamner — and happy to answer any questions."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                icon: MapPin,
                title: { en: 'Address', mr: 'पत्ता' },
                value: address,
                href: mapsLink,
                color: 'text-brand-green bg-brand-green/15 border-brand-green/30',
              },
              {
                icon: Phone,
                title: { en: 'Phone / WhatsApp', mr: 'फोन / WhatsApp' },
                value: `+91 ${phone}`,
                href: `tel:+91${phone}`,
                color: 'text-brand-amber bg-brand-amber/15 border-brand-amber/30',
              },
              {
                icon: Mail,
                title: { en: 'Email', mr: 'ईमेल' },
                value: email,
                href: `mailto:${email}`,
                color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a key={i} href={item.href} target={i === 0 ? '_blank' : undefined} rel="noopener noreferrer"
                  className="bg-white/3 border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/5 hover:border-white/20 transition-all group">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">{l(item.title)}</p>
                    <p className="text-white font-semibold text-sm group-hover:text-brand-green transition-colors">{item.value}</p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Google Maps Embed */}
          <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden h-64">
            <iframe
              src={`https://maps.google.com/maps?q=Talegaon+Dighe+Sangamner+Maharashtra&output=embed&z=14`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Trimitra Coaching Centre Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}

// ─── FAQ Accordion Component ────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white/3 border border-white/10 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
        <span className="text-white font-semibold text-sm pr-4">{question}</span>
        <ChevronDown size={18} className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="px-6 pb-5 pt-1">
        <p className="text-slate-300 text-sm leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}
