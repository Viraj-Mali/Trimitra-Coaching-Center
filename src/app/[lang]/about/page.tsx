import { getDictionary } from '@/dictionaries';
import { BookOpen, Target, Users, Award, Heart, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

interface Props { params: { lang: string } }

export default async function AboutPage({ params }: Props) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  let settings: any = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch (e) {
    console.error('Failed to fetch settings from database for About page:', e);
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="section-title">About Trimitra</h1>
          <p className="section-subtitle">Dedicated to concept-first learning, student mentorship, and structured preparation.</p>
        </div>

        {/* Founder */}
        <div className="glass-card border border-brand-green/20 p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-brand-green/40 mx-auto mb-4 shadow-xl relative">
                <Image
                  src={settings?.mentorImageUrl || "/mentor-sarthak.png"}
                  alt="Dr. Sarthak Dighe - Founder & Head Mentor"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h2 className="text-white font-bold text-2xl">Dr. Sarthak Dighe</h2>
              <p className="text-brand-green font-medium">Founder & Head Mentor</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['BAMS', 'JEE/NEET/NATA Mentor'].map(tag => (
                  <span key={tag} className="badge bg-brand-green/10 text-brand-green border-brand-green/20 text-xs">{tag}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-brand-amber text-5xl font-serif mb-4">&ldquo;</div>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                My vision for Trimitra has always been to create an environment where every student feels seen, guided, and empowered to achieve their best. Education is not just about marks — it is about building the confidence to tackle any challenge.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Dr. Dighe has developed a teaching approach that combines rigorous conceptual clarity with exam-specific strategy. His personal involvement in each batch ensures that every student builds a strong academic foundation and receives individual attention.
              </p>
            </div>
          </div>
        </div>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To provide every student with structured, personalized, and technologically-enhanced coaching that prepares them not just for exams, but for lifelong learning.', color: 'text-brand-green', bg: 'bg-brand-green/20 border-brand-green/30' },
            { icon: Lightbulb, title: 'Our Vision', desc: 'To become Talegaon Dighe\'s most trusted coaching institution, recognized for building strong conceptual foundations and empowering students across all academic tracks.', color: 'text-brand-amber', bg: 'bg-brand-amber/20 border-brand-amber/30' },
            { icon: Heart, title: 'Our Values', desc: 'Student-first mentorship, transparent communication with parents, data-driven learning, and zero-compromise on academic integrity.', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-card-hover p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${item.bg}`}>
                  <Icon size={26} className={item.color} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Programs overview */}
        <div className="glass-card p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><BookOpen size={24} className="text-brand-green" /> Our Academic Programs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { track: 'Foundation (6th–8th)', subjects: ['Mathematics', 'Science'], icon: '📚', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
              { track: '9th-10th Board Mastery', subjects: ['Mathematics', 'Science'], icon: '🎯', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
              { track: '11th–12th Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], icon: '🔬', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
              { track: 'JEE & NEET', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], icon: '🏆', color: 'text-brand-amber', bg: 'bg-brand-amber/10 border-brand-amber/20' },
              { track: 'MHT-CET (PCMB)', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], icon: '⚡', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
              { track: 'NATA', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], icon: '📐', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            ].map((prog, i) => (
              <div key={i} className={`rounded-xl border p-4 ${prog.bg}`}>
                <div className="text-3xl mb-2">{prog.icon}</div>
                <h4 className={`font-bold text-sm mb-2 ${prog.color}`}>{prog.track}</h4>
                <ul className="space-y-1">
                  {prog.subjects.map(s => <li key={s} className="text-slate-400 text-xs flex items-center gap-1.5"><span className="w-1 h-1 bg-current rounded-full" />{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
