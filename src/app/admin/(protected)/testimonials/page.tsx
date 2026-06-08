import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TestimonialsClient from './TestimonialsClient';

export default async function TestimonialsPage() {
  const student = await getCurrentStudent();
  if (!student || student.role !== 'ADMIN') redirect('/admin/login');
  return <TestimonialsClient />;
}
