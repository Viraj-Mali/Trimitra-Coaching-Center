import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ResultsClient from './ResultsClient';

export default async function ResultsPage() {
  const student = await getCurrentStudent();
  if (!student || student.role !== 'ADMIN') redirect('/admin/login');
  return <ResultsClient />;
}
