'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Zap, FileText, Bell, User,
  LogOut, Menu, X, Flame, Star, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  student: {
    name: string;
    rollNumber: string;
    role: string;
    track: string;
    streakCount: number;
    totalXP: number;
  };
  logoUrl?: string;
}

const navItems = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/student/dashboard/materials', icon: BookOpen, label: 'Study Materials' },
  { href: '/student/dashboard/quiz', icon: Zap, label: 'Daily Quiz' },
  { href: '/student/dashboard/tests', icon: FileText, label: 'Mock Tests' },
  { href: '/student/dashboard/notices', icon: Bell, label: 'Notices' },
  { href: '/student/dashboard/profile', icon: User, label: 'Profile' },
];

export default function DashboardLayoutClient({ children, student, logoUrl }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/en');
    router.refresh();
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <Link href="/en" className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 shrink-0">
            <Image src={logoUrl || "/logo.png"} alt="Trimitra Logo" fill className="object-contain" />
          </div>
          <div>
            <span className="text-white font-bold block text-sm leading-tight">TRIMITRA</span>
            <span className="text-brand-green text-xs block leading-tight">Coaching Centre</span>
          </div>
        </Link>
      </div>

      {/* Student info */}
      <div className="p-4 border-b border-white/10">
        <div className="glass-card p-3">
          <p className="text-white font-semibold text-sm truncate">{student.name}</p>
          <p className="text-slate-400 text-xs">{student.rollNumber}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-brand-amber text-xs font-bold">
              <Flame size={12} className="animate-flame" /> {student.streakCount}
            </div>
            <div className="flex items-center gap-1 text-brand-green text-xs font-bold">
              <Star size={10} fill="currentColor" /> {student.totalXP} XP
            </div>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-semibold',
              student.role === 'ENROLLED' ? 'bg-brand-green/20 text-brand-green' : 'bg-slate-500/20 text-slate-400'
            )}>
              {student.role === 'ENROLLED' ? '⭐ Enrolled' : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
            >
              <Icon size={18} />
              {item.label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-brand-blue/80 backdrop-blur-md border-r border-white/10 fixed h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-brand-blue border-r border-white/10 flex flex-col animate-slide-in-right">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-brand-blue/90 border-b border-white/10 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-brand-amber text-sm font-bold flex items-center gap-1">
              <Flame size={14} className="animate-flame" /> {student.streakCount}
            </span>
            <span className="text-brand-green text-sm font-bold flex items-center gap-1">
              <Star size={12} fill="currentColor" /> {student.totalXP}
            </span>
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
