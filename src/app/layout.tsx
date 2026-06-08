import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Trimitra Coaching Centre | Expert Coaching for JEE, NEET, MHT-CET, Board Exams',
  description: 'Maharashtra\'s premier coaching centre for Foundation (6th–9th), 10th Board, 11th–12th Science, and Competitive exams (IIT-JEE, NEET, MHT-CET, NATA) under Dr. Sarthak Dighe.',
  keywords: 'coaching centre pune, JEE coaching pune, NEET coaching pune, MHT-CET coaching, 10th board coaching Maharashtra, SSC coaching',
  openGraph: {
    title: 'Trimitra Coaching Centre',
    description: 'Expert coaching for academic excellence and competitive exam success.',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a3a6e',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
