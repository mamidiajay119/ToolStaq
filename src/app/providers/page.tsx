import type { Metadata } from 'next';
import { getAllProviders, getToolsByProviderSlug } from '@/lib/providers';
import ProvidersClient from './ProvidersClient';

export const metadata: Metadata = {
  title: 'Frontier AI Model Providers & Research Labs',
  description: 'Discover the foundation labs, infrastructure engines, and open-weight model providers powering modern AI applications. Compare OpenAI, Anthropic, DeepSeek, Google, Meta, and more.',
};

export default async function ProvidersPage() {
  const providers = await getAllProviders();

  // Fetch tool counts for each provider in parallel
  const toolCounts: Record<string, number> = {};
  await Promise.all(
    providers.map(async (p) => {
      const tools = await getToolsByProviderSlug(p.slug);
      toolCounts[p.slug] = tools.length;
    })
  );

  return <ProvidersClient providers={providers} toolCounts={toolCounts} />;
}
