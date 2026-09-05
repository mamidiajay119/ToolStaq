import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTools } from '@/lib/tools';
import CompareClient from './CompareClient';
import { getAbsoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Compare AI Tools Side-by-Side — Pricing, Features & Specs',
  description: 'Compare AI tools side-by-side. Evaluate pricing, features, complexity, API availability, and specs to choose the best tool.',
  alternates: {
    canonical: getAbsoluteUrl('/compare'),
  },
  openGraph: {
    title: 'Compare AI Tools Side-by-Side — toolstaq',
    description: 'Compare features, pricing tiers, API access, and deployment types across top AI tools.',
    url: getAbsoluteUrl('/compare'),
  },
};

export default async function ComparePage() {
  const tools = await getAllTools();
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <CompareClient tools={tools} />
    </Suspense>
  );
}
