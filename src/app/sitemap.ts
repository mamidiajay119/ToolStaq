import { MetadataRoute } from 'next';
import { getAllSlugs, getAllCategories, slugifyCategory } from '@/lib/tools';
import { getAllProviders } from '@/lib/providers';
import { getAbsoluteUrl } from '@/lib/siteConfig';
import { POPULAR_COMPARISON_PAIRS } from '@/lib/comparison-pairs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/tools', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/categories', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/providers', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/compare', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/news', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/newsletter', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/submit', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/html-sitemap', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((item) => ({
    url: getAbsoluteUrl(item.path),
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const compareRoutes: MetadataRoute.Sitemap = POPULAR_COMPARISON_PAIRS.map((pair) => ({
    url: getAbsoluteUrl(`/compare/${pair.slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const slugs = await getAllSlugs();
  const toolRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: getAbsoluteUrl(`/tools/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: getAbsoluteUrl(`/category/${slugifyCategory(cat)}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const providers = await getAllProviders();
  const providerRoutes: MetadataRoute.Sitemap = providers.map((prov) => ({
    url: getAbsoluteUrl(`/providers/${prov.slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...compareRoutes, ...categoryRoutes, ...providerRoutes, ...toolRoutes];
}


