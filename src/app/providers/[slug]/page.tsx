import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProviders, getProviderBySlug, getToolsByProviderSlug } from '@/lib/providers';
import { fetchLiveModelsByProvider } from '@/lib/openrouter';
import ProviderDetailClient from './ProviderDetailClient';

export async function generateStaticParams() {
  const providers = await getAllProviders();
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: 'Provider Not Found' };

  return {
    title: `${provider.name} AI Models & Ecosystem Tools — toolstaq`,
    description: `Explore live AI models, context windows, and tools built on ${provider.name}. Discover applications powered by ${provider.name}'s foundation models.`,
  };
}

export default async function ProviderDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  // Run live model fetch and tools query in parallel
  const [liveModels, tools] = await Promise.all([
    fetchLiveModelsByProvider(provider.openrouter_id),
    getToolsByProviderSlug(provider.slug),
  ]);

  return <ProviderDetailClient provider={provider} liveModels={liveModels} tools={tools} />;
}
