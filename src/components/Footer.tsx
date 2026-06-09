import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Youtube, Instagram } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface FooterProps {
  lang?: string;
}

const quickLinks = [
  { href: '#courses', label: { en: 'Courses', mr: 'अभ्यासक्रम' } },
  { href: '#why-us', label: { en: 'Why Trimitra', mr: 'त्रिमित्र का?' } },
  { href: '#mentor', label: { en: 'About Mentor', mr: 'मार्गदर्शकाबद्दल' } },
  { href: '#gallery', label: { en: 'Gallery', mr: 'गॅलरी' } },
  { href: '#enroll-form', label: { en: 'Enroll Now', mr: 'प्रवेश नोंदणी' } },
];

const courseLinks = [
  { label: { en: 'Foundation (6th–9th)', mr: 'फाउंडेशन (६वी–९वी)' }, href: '/en/courses/foundation_6_9' },
  { label: { en: '10th Board Mastery', mr: '१०वी बोर्ड' }, href: '/en/courses/board_10' },
  { label: { en: '11th–12th Science', mr: '११वी–१२वी विज्ञान' }, href: '/en/courses/science_11_12' },
  { label: { en: 'JEE / NEET / MHT-CET', mr: 'स्पर्धा परीक्षा' }, href: '/en/courses/competitive' },
];

export default async function Footer({ lang = 'en' }: FooterProps) {
  const l = (obj: { en: string; mr: string }) => obj[lang as 'en' | 'mr'] || obj.en;

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  const whatsapp = settings?.whatsapp || '9665269059';
  const phone = settings?.phone || '9665269059';
  const email = settings?.email || 'info@trimitra.in';
  const address = settings?.address || '2nd Floor, Society Complex, Talegaon Dighe, Tal. Sangamner, Dist. Ahmednagar, Maharashtra';
  const fb = settings?.facebook || '#';
  const insta = settings?.instagram || '#';
  const yt = settings?.youtube || '#';

  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20at%20Trimitra%20Coaching%20Centre.`;

  return (
    <footer className="bg-[#091c38] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Trimitra Coaching Centre" fill className="object-contain" />
              </div>
              <div>
                <span className="text-white font-extrabold text-lg block leading-tight">TRIMITRA</span>
                <span className="text-brand-green text-xs font-medium block">Coaching Centre</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {lang === 'mr'
                ? 'केंद्रित मार्गदर्शन आणि संरचित शिक्षणाद्वारे विद्यार्थ्यांना त्यांचे शैक्षणिक स्वप्ने साध्य करण्यासाठी सक्षम बनवणे.'
                : 'Empowering students of Maharashtra to achieve academic excellence through focused mentorship, small batches, and structured learning.'}
            </p>
            <div className="flex items-center gap-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-all">
                <MessageCircle size={16} />
              </a>
              <a href={fb} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-all">
                <Facebook size={16} />
              </a>
              <a href={yt} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-all">
                <Youtube size={16} />
              </a>
              <a href={insta} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-pink-500/20 border border-pink-500/30 rounded-xl flex items-center justify-center text-pink-400 hover:bg-pink-500/30 transition-all">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {lang === 'mr' ? 'द्रुत दुवे' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-400 hover:text-brand-green text-sm transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-green/50 rounded-full" />
                    {l(link.label)}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/student/login" className="text-slate-400 hover:text-brand-green text-sm transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-green/50 rounded-full" />
                  {lang === 'mr' ? 'विद्यार्थी लॉगिन' : 'Student Login'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {lang === 'mr' ? 'अभ्यासक्रम' : 'Our Courses'}
            </h3>
            <ul className="space-y-2.5">
              {courseLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-brand-green text-sm transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-amber/50 rounded-full" />
                    {l(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {lang === 'mr' ? 'संपर्क' : 'Contact Us'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={15} className="text-brand-green mt-0.5 shrink-0" />
                <span>{address}</span>
              </li>
              <li>
                <a href={`tel:+91${phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-brand-green transition-colors">
                  <Phone size={15} className="text-brand-green shrink-0" />
                  +91 {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-brand-green transition-colors">
                  <Mail size={15} className="text-brand-green shrink-0" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <MessageCircle size={14} />
                  {lang === 'mr' ? 'WhatsApp वर चॅट करा' : 'Chat on WhatsApp'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Trimitra Coaching Centre. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-slate-600 text-xs hover:text-slate-400 transition-colors">Admin</Link>
            <span className="text-slate-600 text-xs">|</span>
            <Link href="/student/register" className="text-slate-500 text-xs hover:text-brand-green transition-colors">
              {lang === 'mr' ? 'मोफत नोंदणी' : 'Free Registration'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
