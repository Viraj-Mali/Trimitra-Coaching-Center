import { redirect } from 'next/navigation';
import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const [student, settings] = await Promise.all([
    prisma.student.findUnique({
      where: { id: session.id },
      select: { name: true, rollNumber: true, role: true, track: true, streakCount: true, totalXP: true },
    }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ]);
  
  if (!student) redirect('/student/login');

  return (
    <DashboardLayoutClient
      student={{
        name: student.name,
        rollNumber: student.rollNumber,
        role: student.role,
        track: student.track,
        streakCount: student.streakCount,
        totalXP: student.totalXP,
      }}
      logoUrl={settings?.logoUrl ?? '/logo.png'}
    >
      {children}
    </DashboardLayoutClient>
  );
}
