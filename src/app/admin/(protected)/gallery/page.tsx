import { getCurrentStudent } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GalleryClient from './GalleryClient';

export default async function GalleryPage() {
  const student = await getCurrentStudent();
  if (!student || student.role !== 'ADMIN') redirect('/admin/login');
  return <GalleryClient />;
}
