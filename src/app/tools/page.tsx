import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTools, getAllCategories } from '@/lib/tools';
import BrowseToolsClient from './BrowseClient';

export const metadata: Metadata = {
  title: 'Browse All AI Tools — Filter by Category, Pricing & More',
  description: 'Browse and filter top AI tools by category, pricing model, complexity, deployment type, free trial availability, and API access.',
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
