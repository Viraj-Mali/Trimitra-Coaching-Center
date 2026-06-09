'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, LogIn, CalendarCheck, ChevronDown } from 'lucide-react';

interface NavbarClientProps {
  lang: string;
  studentName?: string | null;
  studentRole?: string | null;
  logoUrl?: string | null;
}

const navLinks = [
  { href: '#courses', label: { en: 'Courses', mr: 'अभ्यासक्रम' } },
  { href: '#gallery', label: { en: 'Gallery', mr: 'गॅलरी' } },
  { href: '#why-us', label: { en: 'Why Trimitra', mr: 'त्रिमित्र का?' } },
  { href: '#mentor', label: { en: 'About Mentor', mr: 'मार्गदर्शक' } },
  { href: '#contact', label: { en: 'Contact', mr: 'संपर्क' } },
];

export default function NavbarClient({ lang, studentName, studentRole, logoUrl }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const otherLang = lang === 'en' ? 'mr' : 'en';
  const otherLangLabel = lang === 'en' ? 'मराठी' : 'English';
  const switchLangHref = pathname.replace(`/${lang}`, `/${otherLang}`);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F2E5A]/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <Image src={logoUrl || "/logo.png"} alt="Trimitra Coaching Centre Logo" fill className="object-contain" priority />
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-extrabold text-lg leading-tight block">TRIMITRA</span>
              <span className="text-brand-green text-xs font-medium leading-tight block">Coaching Centre</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {link.label[lang as 'en' | 'mr'] || link.label.en}
              </a>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href={switchLangHref}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all font-medium"
            >
              <Globe size={13} />
              {otherLangLabel}
            </Link>
            {studentName ? (
              <>
                <Link
                  href={studentRole === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-green/20 border border-brand-green/40 rounded-xl hover:bg-brand-green/30 transition-all"
                >
                  {studentName.split(' ')[0]} →
                </Link>
              </>
            ) : (
              <>
                <Link href="/student/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                  <LogIn size={14} /> {lang === 'mr' ? 'लॉगिन' : 'Student Login'}
                </Link>
                <a
                  href="#enroll-form"
                  onClick={(e) => handleAnchor(e, '#enroll-form')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-amber hover:bg-amber-500 rounded-xl transition-all shadow-md hover:shadow-amber-500/30"
                >
                  <CalendarCheck size={14} /> {lang === 'mr' ? 'प्रवेश नोंदणी' : 'Enroll Now'}
                </a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0F2E5A]/98 backdrop-blur-md border-t border-white/10 pb-4">
          <nav className="px-4 pt-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all"
              >
                {link.label[lang as 'en' | 'mr'] || link.label.en}
              </a>
            ))}
          </nav>
          <div className="px-4 pt-3 border-t border-white/10 mt-3 space-y-2">
            <Link href={switchLangHref} className="flex items-center justify-center gap-2 w-full py-3 text-sm text-slate-300 border border-white/20 rounded-xl font-medium hover:bg-white/5">
              <Globe size={14} /> Switch to {otherLangLabel}
            </Link>
            {studentName ? (
              <Link href={studentRole === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} className="block w-full py-3 text-center text-sm font-semibold text-white bg-brand-green/20 border border-brand-green/40 rounded-xl">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/student/login" className="block w-full py-3 text-center text-sm font-medium text-slate-300 border border-white/20 rounded-xl hover:bg-white/5">
                  {lang === 'mr' ? 'विद्यार्थी लॉगिन' : 'Student Login'}
                </Link>
                <a
                  href="#enroll-form"
                  onClick={(e) => handleAnchor(e, '#enroll-form')}
                  className="block w-full py-3 text-center text-sm font-semibold text-white bg-brand-amber rounded-xl"
                >
                  {lang === 'mr' ? 'प्रवेशासाठी नोंदणी करा' : 'Enroll Now'}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
