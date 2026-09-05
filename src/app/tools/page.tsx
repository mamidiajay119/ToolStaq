import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTools, getAllCategories } from '@/lib/tools';
import BrowseToolsClient from './BrowseClient';
import { getAbsoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Browse & Filter All AI Tools — toolstaq Directory',
  description: 'Search, filter, and compare top AI tools by category, pricing model, complexity, deployment type, free trial availability, and API access.',
  alternates: {
    canonical: getAbsoluteUrl('/tools'),
  },
  openGraph: {
    title: 'Browse All AI Tools — toolstaq',
    description: 'Filter top AI software across all categories, pricing models, and deployment types.',
    url: getAbsoluteUrl('/tools'),
  },
};

export default async function BrowsePage() {
  const tools = await getAllTools();
  const categories = getAllCategories();

  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tools...</div>}>
      <BrowseToolsClient tools={tools} allCategories={categories} />
    </Suspense>
  );
}
