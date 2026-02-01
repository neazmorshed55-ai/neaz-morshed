import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Disallow admin routes
    },
    sitemap: 'https://neazmorshed.com/sitemap.xml',
  };
}
