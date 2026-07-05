import { MetadataRoute } from 'next';
import { getAllSlugs, getAllCategories, slugifyCategory } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aitoolsdirectory.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${base}/tools/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${base}/category/${slugifyCategory(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
