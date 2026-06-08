import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import MaterialsClient from './MaterialsClient';

export default async function MaterialsPage() {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });

  return (
    <MaterialsClient
      role={session.role}
      track={session.track}
      phone={settings?.phone || '9665269059'}
    />
  );
}
