export const siteConfig = {
  name: 'toolstaq',
  title: 'toolstaq — The Intelligent Index for Frontier AI Tools',
  description:
    'The most comprehensive AI tools directory. Discover, compare, and filter top AI tools by category, pricing, complexity, and ecosystem.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolstaq.com',
  ogImage: '/og-image.png',
  twitterHandle: '@toolstaq',
  keywords: [
    'AI tools',
    'artificial intelligence',
    'AI software',
    'machine learning tools',
    'AI directory',
    'AI models',
    'AI comparison',
  ],
};

export function getAbsoluteUrl(path: string = ''): string {
  const base = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function getOgImageUrl(options: {
  title?: string;
  subtitle?: string;
  category?: string;
  type?: string;
  logo?: string;
} = {}): string {
  const params = new URLSearchParams();
  if (options.title) params.set('title', options.title);
  if (options.subtitle) params.set('subtitle', options.subtitle);
  if (options.category) params.set('category', options.category);
  if (options.type) params.set('type', options.type);
  if (options.logo) params.set('logo', options.logo);

  const queryString = params.toString();
  return getAbsoluteUrl(`/api/og${queryString ? `?${queryString}` : ''}`);
}

