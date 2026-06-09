import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface Props {
  children: React.ReactNode;
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang;
  return {
    title: lang === 'mr'
      ? 'त्रिमित्र कोचिंग सेंटर | तळेगाव दिघे, संगमनेर'
      : 'Trimitra Coaching Centre | Talegaon Dighe',
    description: lang === 'mr'
      ? 'तळेगाव दिघे जवळील संगमनेर येथे ६वी ते १२वी, बोर्ड परीक्षा, JEE, NEET आणि MHT-CET साठी वैयक्तिक मार्गदर्शन.'
      : 'Trimitra Coaching Centre offers small-batch coaching for Class 6th–12th, Board Exams, JEE, NEET and MHT-CET in Talegaon Dighe near Sangamner, Ahmednagar.',
    keywords: lang === 'mr'
      ? ['त्रिमित्र कोचिंग', 'तळेगाव दिघे कोचिंग', 'संगमनेर जवळ कोचिंग', 'JEE कोचिंग', 'NEET कोचिंग', 'MHT-CET', 'बोर्ड परीक्षा']
      : ['Trimitra Coaching Centre', 'coaching classes in Talegaon Dighe', 'JEE coaching near Sangamner', 'NEET coaching', 'MHT-CET coaching', '10th Board coaching', 'HSC coaching'],
    openGraph: {
      title: 'Trimitra Coaching Centre, Talegaon Dighe',
      description: 'Expert coaching for Class 6th to 12th, JEE, NEET, MHT-CET, and Board exams.',
      type: 'website',
      locale: lang === 'mr' ? 'mr_IN' : 'en_IN',
    },
  };
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'mr' }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = params;
  
  // Need to handle database connection gracefully
  let phone = '9665269059';
  let whatsapp = '9665269059';
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (settings?.phone) phone = settings.phone;
    if (settings?.whatsapp) whatsapp = settings.whatsapp;
  } catch (e) {
    console.error('Error fetching site settings for layout CTA:', e);
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 sm:pb-0">
      <Navbar lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
      <MobileStickyCTA phone={phone} whatsapp={whatsapp} lang={lang} />
    </div>
  );
}
