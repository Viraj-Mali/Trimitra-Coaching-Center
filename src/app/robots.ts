import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://trimitra-coaching-center.vercel.app'; // Update this to production domain when ready

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/student/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
