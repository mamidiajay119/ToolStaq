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
    <>
      <div className="inner-hero inner-hero-left" style={{ paddingBottom: '5rem' }}>
        <div className="container-xl">
          <h1>AI Tools</h1>
          <p>Explore hand-curated AI tools for your workflow.</p>
        </div>
        <div className="inner-hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
            <path 
              d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" 
              fill="var(--bg-primary)"
            />
          </svg>
        </div>
      </div>
      <div className="container-xl" style={{ paddingBottom: '1.5rem' }}>
        <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tools...</div>}>
          <BrowseToolsClient tools={tools} allCategories={categories} />
        </Suspense>
      </div>
    </>
  );
}
