import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import FAQClient from './FAQClient';

export default async function FAQPage() {
  const student = await getCurrentStudent();
  if (!student || student.role !== 'ADMIN') redirect('/admin/login');
  return <FAQClient />;
}
