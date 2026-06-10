'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, UserCheck, BookOpen, FileText,
  LogOut, Menu, X, ChevronRight, BookMarked, Star,
  Trophy, Images, HelpCircle, Settings, Bell, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminName: string;
}

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/leads', icon: Users, label: 'Enquiries' },
  { href: '/admin/students', icon: UserCheck, label: 'Students' },
  { href: '/admin/courses', icon: BookMarked, label: 'Courses' },
  { href: '/admin/syllabus', icon: ClipboardList, label: 'Syllabus' },
  { href: '/admin/content', icon: BookOpen, label: 'Study Material' },
  { href: '/admin/tests', icon: FileText, label: 'Test Scores' },
  { href: '/admin/results', icon: Trophy, label: 'Results' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { href: '/admin/gallery', icon: Images, label: 'Gallery' },
  { href: '/admin/faq', icon: HelpCircle, label: 'FAQs' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayoutClient({ children, adminName }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <Image src="/logo.png" alt="Trimitra Logo" fill className="object-contain" />
          </div>
          <div>
            <span className="text-white font-bold text-sm block leading-tight">TRIMITRA</span>
            <span className="text-brand-amber text-xs">Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 glass-card">
          <div className="w-8 h-8 bg-brand-amber/20 rounded-lg flex items-center justify-center text-brand-amber font-bold text-sm">
            {adminName.charAt(0)}
          </div>
          <div>
            <p className="text-white text-xs font-semibold truncate">{adminName}</p>
            <p className="text-brand-amber text-xs">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
            >
              <Icon size={16} />
              <span className="text-sm">{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/en" className="sidebar-item w-full text-slate-400 text-sm mb-1">
          ← View Website
        </Link>
        <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      <aside className="hidden lg:flex w-64 flex-col bg-brand-blue/90 backdrop-blur-md border-r border-white/10 fixed h-full z-30">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-brand-blue border-r border-white/10 flex flex-col animate-[slideInLeft_0.3s_ease-out]">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 w-full">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-brand-blue/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20 shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-white font-bold text-sm tracking-wide">TRIMITRA</span>
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
