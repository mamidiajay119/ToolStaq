import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTools } from '@/lib/tools';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare AI Tools — Side-by-Side Feature Comparison',
  description: 'Compare AI tools side-by-side. Evaluate pricing, features, complexity, API availability, and more to find the best tool for your needs.',
};

export default function ComparePage() {
  const tools = getAllTools();
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <CompareClient tools={tools} />
    </Suspense>
  );
}
