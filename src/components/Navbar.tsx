import NavbarClient from './NavbarClient';
import { prisma } from '@/lib/prisma';

interface NavbarProps {
  lang: string;
}

export default async function Navbar({ lang }: NavbarProps) {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch (e) {
    console.error(e);
  }

  return (
    <NavbarClient
      lang={lang}
      studentName={null}
      studentRole={null}
      logoUrl={settings?.logoUrl ?? '/logo.png'}
    />
  );
}
