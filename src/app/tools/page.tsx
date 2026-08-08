import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTools, getAllCategories } from '@/lib/tools';
import BrowseToolsClient from './BrowseClient';

export const metadata: Metadata = {
  title: 'Browse All AI Tools — Filter by Category, Pricing & More',
  description: 'Browse and filter top AI tools by category, pricing model, complexity, deployment type, free trial availability, and API access.',
};

export default function BrowsePage() {
  const tools = getAllTools();
  const categories = getAllCategories();

  return (
    <div className="container-xl" style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
      <div style={{ paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          AI Tools
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Explore hand-curated AI tools for your workflow.
        </p>
      </div>
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tools...</div>}>
        <BrowseToolsClient tools={tools} allCategories={categories} />
      </Suspense>
    </div>
  );
}
