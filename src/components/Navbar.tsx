import { getCurrentStudent } from '@/lib/auth';
import NavbarClient from './NavbarClient';
import { prisma } from '@/lib/prisma';

interface NavbarProps {
  lang: string;
}

export default async function Navbar({ lang }: NavbarProps) {
  const [session, settings] = await Promise.all([
    getCurrentStudent(),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ]);

  return (
    <NavbarClient
      lang={lang}
      studentName={session?.name ?? null}
      studentRole={session?.role ?? null}
      logoUrl={settings?.logoUrl ?? '/logo.png'}
    />
  );
}
