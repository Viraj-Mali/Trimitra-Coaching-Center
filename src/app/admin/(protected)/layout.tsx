import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') redirect('/admin/login');
  return <AdminLayoutClient adminName={session.name}>{children}</AdminLayoutClient>;
}
