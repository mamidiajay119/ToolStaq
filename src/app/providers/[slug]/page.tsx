import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProviders, getProviderBySlug, getToolsByProviderSlug } from '@/lib/providers';
import { fetchLiveModelsByProvider } from '@/lib/openrouter';
import ProviderDetailClient from './ProviderDetailClient';
import { getAbsoluteUrl, getOgImageUrl } from '@/lib/siteConfig';

export async function generateStaticParams() {
  const providers = await getAllProviders();
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: 'Provider Not Found' };
  const pageUrl = getAbsoluteUrl(`/providers/${slug}`);
  const title = `${provider.name} AI Models & Ecosystem Tools — toolstaq`;
  const description = `Explore live AI models, context windows, and tools built on ${provider.name}. Discover applications powered by ${provider.name}'s foundation models.`;

  const ogImage = getOgImageUrl({
    title: provider.name,
    subtitle: description,
    category: 'Foundation Model Lab',
    type: 'Model Ecosystem',
    logo: provider.logo_url,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${provider.name} AI Models & Ecosystem — toolstaq`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
    },
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

  const pageUrl = getAbsoluteUrl(`/providers/${slug}`);

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: provider.name,
    description: provider.description,
    url: provider.website_url,
    logo: provider.logo_url,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: getAbsoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Providers', item: getAbsoluteUrl('/providers') },
      { '@type': 'ListItem', position: 3, name: provider.name, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ProviderDetailClient provider={provider} liveModels={liveModels} tools={tools} />
    </>
  );
}

