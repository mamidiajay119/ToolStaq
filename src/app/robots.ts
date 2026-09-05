import { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/go/', '/api/'],
      },
    ],
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}

