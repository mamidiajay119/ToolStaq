import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Zap, Globe, ChevronRight,
  Code2, Lock, Gift, RefreshCw, Users, ArrowRight, Shield
} from 'lucide-react';
import { getAllSlugs, getToolBySlug, getPricingLabel, slugifyCategory, getToolDescription, getToolsByNames, getInitialUpvotes } from '@/lib/tools';
import type { Tool } from '@/types/tool';
import ToolCard from '@/components/tools/ToolCard';
import ToolHero from '@/components/tools/ToolHero';

import { getAbsoluteUrl, getOgImageUrl } from '@/lib/siteConfig';
import { urlToFaviconSrc } from '@/lib/favicon';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };

  const pricingLabel = getPricingLabel(tool);
  const desc = tool.decision_summary || getToolDescription(tool);
  const pageUrl = getAbsoluteUrl(`/tools/${slug}`);
  const logoSrc = tool.favicon_url || urlToFaviconSrc(tool.url);

  const ogImage = getOgImageUrl({
    title: tool.tool_name,
    subtitle: desc.slice(0, 160),
    category: tool.primary_category,
    type: 'AI Tool Review',
    logo: logoSrc,
  });

  return {
    title: `${tool.tool_name} — ${tool.primary_category} Tool Review, Pricing & Alternatives`,
    description: desc.slice(0, 160),
    openGraph: {
      title: `${tool.tool_name} | toolstaq`,
      description: desc.slice(0, 160),
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tool.tool_name} — AI Tool Review & Pricing`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.tool_name} | toolstaq`,
      description: desc.slice(0, 160),
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

function Badge({ label, variant = 'violet' }: { label: string; variant?: string }) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const pricingLabel = getPricingLabel(tool);
  const categorySlug = slugifyCategory(tool.primary_category);
  const baseUpvotes = getInitialUpvotes(tool.slug, tool.is_recommended);

  // Fetch alternative tools directly by name — no full-dataset scan needed
  const altNames = (tool.alternatives || []).slice(0, 3);
  const alternativeTools = await getToolsByNames(altNames);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.tool_name,
    applicationCategory: tool.primary_category,
    operatingSystem: tool.deployment,
    url: tool.url,
    offers: tool.starting_price_usd
      ? {
          '@type': 'Offer',
          price: tool.starting_price_usd,
          priceCurrency: 'USD',
        }
      : { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: getToolDescription(tool),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tools', item: getAbsoluteUrl('/tools') },
      { '@type': 'ListItem', position: 2, name: tool.primary_category, item: getAbsoluteUrl(`/category/${categorySlug}`) },
      { '@type': 'ListItem', position: 3, name: tool.tool_name, item: getAbsoluteUrl(`/tools/${slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <style>{`
        .tool-breadcrumb {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
        }
        .tool-breadcrumb a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 150ms ease;
        }
        .tool-breadcrumb a:hover {
          color: var(--accent-primary);
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
        {/* Breadcrumb */}
        <nav className="tool-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/tools">Tools</Link>
          <span>/</span>
          <Link href={`/category/${categorySlug}`}>
            {tool.primary_category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tool.tool_name}</span>
        </nav>

        <div className="tool-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem', alignItems: 'start' }}>
          {/* ── Main Content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Hero — animated client component */}
            <ToolHero
              toolName={tool.tool_name}
              toolSlug={tool.slug}
              toolUrl={tool.url}
              toolIcon={tool.icon ?? null}
              toolFaviconUrl={tool.favicon_url ?? null}
              toolTitle={tool.title ?? null}
              categories={tool.category.map((cat) => ({ cat, slug: slugifyCategory(cat) }))}
              isRecommended={!!tool.is_recommended}
              isNew={!!tool.is_new}
              openSource={!!tool.open_source}
              baseUpvotes={baseUpvotes}
            />

            {/* ── Unified Overview Card ── */}
            <div style={{
              background: 'var(--bg-card)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>

              {/* About */}
              <div style={{ padding: '1.75rem 2rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
                  Overview
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
                  {getToolDescription(tool)}
                </p>
              </div>

              {/* Focus Area */}
              {tool.focus_area && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                  <div style={{ padding: '1.75rem 2rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Focus Area
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {tool.focus_area}
                    </p>
                  </div>
                </>
              )}

              {/* Core Features */}
              {(tool.core_features_rich || tool.core_features.length > 0) && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                  <div style={{ padding: '1.75rem 2rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Core Features & Capabilities
                    </p>
                    {tool.core_features_rich ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tool.core_features_rich.split('\n').filter(Boolean).map((f, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                             <ChevronRight size={14} strokeWidth={2.5} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px' }} />
                             <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.replace(/^[•-]\s*/, '')}</span>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {tool.core_features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <ChevronRight size={14} strokeWidth={2.5} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px' }} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Best For — merged use cases + personas */}
              {(() => {
                const GENERIC = new Set(['Writing long-form SEO blog articles']);
                const cleanBestFor = tool.best_for.filter((b) => !GENERIC.has(b));
                const hasContent = cleanBestFor.length > 0 || tool.target_user_persona.length > 0;
                return hasContent && (
                  <>
                    <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                    <div style={{ padding: '1.75rem 2rem' }}>
                      <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                        Best For
                      </p>
                      {cleanBestFor.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: tool.target_user_persona.length > 0 ? '1rem' : 0 }}>
                          {cleanBestFor.map((b, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <ChevronRight size={14} strokeWidth={2.5} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px' }} />
                              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {tool.target_user_persona.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {tool.target_user_persona.map((p) => (
                            <span key={p} className="monochrome-pill-badge-sm">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}


              {/* Integrations */}
              {tool.integrations.length > 0 && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                  <div style={{ padding: '1.75rem 2rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Integrations
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {tool.integrations.map((int) => (
                        <span key={int} className="monochrome-pill-badge-sm">{int}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Technical Architecture */}
              {tool.technical_architecture && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                  <div style={{ padding: '1.75rem 2rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Architecture & Security
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tool.technical_architecture.split('\n').filter(Boolean).map((f, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                           <ChevronRight size={14} strokeWidth={2.5} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px' }} />
                           <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.replace(/^[•-]\s*/, '')}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Pricing Details */}
              {tool.pricing_details && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                  <div style={{ padding: '1.75rem 2rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Pricing Details
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tool.pricing_details.split('\n').filter(Boolean).map((f, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                           <ChevronRight size={14} strokeWidth={2.5} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px' }} />
                           <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.replace(/^[•-]\s*/, '')}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '80px' }}>
            {/* Quick Info */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Quick Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Pricing', value: pricingLabel },
                  { label: 'Complexity', value: tool.complexity_level },
                  { label: 'Deployment', value: tool.deployment },
                  { label: 'Time to Value', value: tool.time_to_value },
                  { label: 'API Available', value: tool.has_api ? 'Yes' : 'No' },
                  { label: 'Free Trial', value: tool.free_trial ? 'Yes' : 'No' },
                  { label: 'Open Source', value: tool.open_source ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compare Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Compare {tool.tool_name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Compare features, pricing, and specs side-by-side with top alternatives.
              </p>
              <Link
                href={`/compare?tool=${tool.slug}`}
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', marginTop: '4px', textDecoration: 'none' }}
              >
                Compare Tools <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
              </Link>
            </div>

            {/* Alternatives */}
            {alternativeTools.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '1rem', paddingLeft: '4px' }}>
                  Alternatives to {tool.tool_name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {alternativeTools.map((altTool) => (
                    <ToolCard key={altTool.slug} tool={altTool} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Responsive overrides */}
        <style>{`
          @media (max-width: 900px) {
            .tool-page-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </>
  );
}
