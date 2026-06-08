import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

interface Props {
  children: React.ReactNode;
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang;
  return {
    title: lang === 'mr'
      ? 'त्रिमित्र कोचिंग सेंटर | JEE, NEET, MHT-CET, बोर्ड परीक्षांसाठी तज्ञ शिकवणी'
      : 'Trimitra Coaching Centre | Expert Coaching for JEE, NEET, MHT-CET & Board Exams in Pune',
    description: lang === 'mr'
      ? 'पुण्यातील अग्रगण्य शिकवणी केंद्र. डॉ. सार्थक दिघे यांच्या मार्गदर्शनाखाली लहान बॅचेस, वैयक्तिक लक्ष आणि सिद्ध निकाल.'
      : "Pune's trusted coaching centre under Dr. Sarthak Dighe. Small batches, personal attention, and proven results for JEE, NEET, MHT-CET, NATA, and SSC/HSC Board exams.",
    keywords: lang === 'mr'
      ? ['त्रिमित्र कोचिंग', 'पुणे कोचिंग', 'JEE कोचिंग', 'NEET कोचिंग', 'MHT-CET', 'बोर्ड परीक्षा']
      : ['Trimitra Coaching Centre', 'coaching classes Pune', 'JEE coaching Pune', 'NEET coaching', 'MHT-CET coaching', '10th Board coaching Pune', 'HSC coaching'],
    openGraph: {
      title: 'Trimitra Coaching Centre, Pune',
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
