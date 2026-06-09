import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Trimitra Coaching Centre | Expert Coaching for JEE, NEET, MHT-CET, Board Exams',
  description: 'Maharashtra\'s premier coaching centre for Foundation (6th–9th), 10th Board, 11th–12th Science, and Competitive exams (IIT-JEE, NEET, MHT-CET, NATA) under Dr. Sarthak Dighe.',
  keywords: 'coaching classes in Talegaon Dighe, coaching classes near Sangamner, JEE coaching near Sangamner, NEET coaching near Sangamner, MHT-CET coaching near Sangamner, 10th board coaching, 11th 12th Science coaching',
  openGraph: {
    title: 'Trimitra Coaching Centre | Expert Coaching in Pune',
    description: 'Expert coaching for academic excellence and competitive exam success. Foundation, Board Exams, Science, JEE, and NEET.',
    url: 'https://trimitra-coaching-center.vercel.app',
    siteName: 'Trimitra Coaching Centre',
    images: [
      {
        url: '/hero-classroom.jpg',
        width: 1200,
        height: 630,
        alt: 'Trimitra Coaching Centre Pune',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trimitra Coaching Centre | Pune',
    description: 'Expert coaching for academic excellence and competitive exam success.',
    images: ['/hero-classroom.jpg'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Trimitra Coaching Centre',
  image: 'https://trimitra-coaching-center.vercel.app/logo.png',
  '@id': 'https://trimitra-coaching-center.vercel.app',
  url: 'https://trimitra-coaching-center.vercel.app',
  telephone: '+919665269059',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2nd Floor Society Complex',
    addressLocality: 'Talegaon Dighe',
    addressRegion: 'Maharashtra',
    postalCode: '424611',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 18.52043, // Using standard Pune coords; update if needed
    longitude: 73.856743,
  },
  sameAs: [
    'https://www.facebook.com/TrimitraCoaching',
    'https://www.instagram.com/TrimitraCoaching',
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
