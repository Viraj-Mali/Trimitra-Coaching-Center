import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SyllabusClient from './SyllabusClient';

export default async function SyllabusPage() {
  const student = await getCurrentStudent();
  if (!student || student.role !== 'ADMIN') redirect('/admin/login');

  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true, slug: true, targetTrack: true },
  });

  return <SyllabusClient courses={courses} />;
}
