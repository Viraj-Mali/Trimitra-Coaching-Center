import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const student = await getCurrentStudent();
  if (!student || student.role !== 'ADMIN') redirect('/admin/login');
  return <SettingsClient />;
}
