import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import { getAbsoluteUrl, getOgImageUrl } from '@/lib/siteConfig';
import { resolveComparisonSlug, POPULAR_COMPARISON_PAIRS } from '@/lib/comparison-pairs';
import CompareClient from '../CompareClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POPULAR_COMPARISON_PAIRS.map((pair) => ({
    slug: pair.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pair = resolveComparisonSlug(slug);
  if (!pair) return {};

  const [t1, t2] = await Promise.all([
    getToolBySlug(pair.slug1),
    getToolBySlug(pair.slug2),
  ]);

  if (!t1 || !t2) return {};

  const title = `${t1.tool_name} vs ${t2.tool_name} — Side-by-Side AI Tool Comparison`;
  const description = `Compare ${t1.tool_name} vs ${t2.tool_name} side-by-side. Evaluate pricing, features, complexity, deployment, target users, and API access on toolstaq.`;
  const canonicalUrl = getAbsoluteUrl(`/compare/${slug}`);
  const ogImageUrl = getOgImageUrl({
    title: `${t1.tool_name} vs ${t2.tool_name}`,
    category: t1.primary_category || 'AI Comparison',
  });

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${t1.tool_name} vs ${t2.tool_name} Comparison`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CompareSlugPage({ params }: Props) {
  const { slug } = await params;
  const pair = resolveComparisonSlug(slug);

  if (!pair) {
    notFound();
  }

  const [t1, t2, allTools] = await Promise.all([
    getToolBySlug(pair.slug1),
    getToolBySlug(pair.slug2),
    getAllTools(),
  ]);

  if (!t1 || !t2) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${t1.tool_name} vs ${t2.tool_name} Comparison`,
    description: `Side-by-side comparison of ${t1.tool_name} and ${t2.tool_name}`,
    url: getAbsoluteUrl(`/compare/${slug}`),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'SoftwareApplication',
            name: t1.tool_name,
            applicationCategory: t1.primary_category,
            url: getAbsoluteUrl(`/tools/${t1.slug}`),
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'SoftwareApplication',
            name: t2.tool_name,
            applicationCategory: t2.primary_category,
            url: getAbsoluteUrl(`/tools/${t2.slug}`),
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading comparison...</div>}>
        <CompareClient tools={allTools} initialSlugs={[t1.slug, t2.slug]} />
      </Suspense>
    </>
  );
}
