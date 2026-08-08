import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ExternalLink, ArrowLeft, Zap, Globe,
  Code2, Lock, Gift, RefreshCw, Users, ArrowRight, Shield
} from 'lucide-react';
import { getAllSlugs, getToolBySlug, getPricingLabel, slugifyCategory, getToolDescription, getAllTools } from '@/lib/tools';
import type { Tool } from '@/types/tool';
import ToolLogo from '@/components/tools/ToolLogo';
import ToolCard from '@/components/tools/ToolCard';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };

  const pricingLabel = getPricingLabel(tool);
  const desc = tool.decision_summary || getToolDescription(tool);

  return {
    title: `${tool.tool_name} — ${tool.primary_category} Tool Review, Pricing & Alternatives`,
    description: desc.slice(0, 160),
    openGraph: {
      title: `${tool.tool_name} | ToolStaq`,
      description: desc.slice(0, 160),
      url: `https://aitoolsdirectory.com/tools/${slug}`,
    },
    alternates: {
      canonical: `https://aitoolsdirectory.com/tools/${slug}`,
    },
  };
}

function Badge({ label, variant = 'violet' }: { label: string; variant?: string }) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const pricingLabel = getPricingLabel(tool);
  const categorySlug = slugifyCategory(tool.primary_category);

  // Fetch full tool objects for alternatives
  const allTools = getAllTools();
  const alternativeTools = tool.alternatives
    .map(altName => allTools.find(t => t.tool_name === altName))
    .filter((t): t is Tool => t !== undefined)
    .slice(0, 3); // Limit to 3 alternative cards in sidebar

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-xl" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <Link href="/" className="btn-ghost" style={{ padding: '4px 0', fontSize: '0.825rem' }}>Home</Link>
          <span>/</span>
          <Link href="/tools" className="btn-ghost" style={{ padding: '4px 0', fontSize: '0.825rem' }}>Tools</Link>
          <span>/</span>
          <Link href={`/category/${categorySlug}`} className="btn-ghost" style={{ padding: '4px 0', fontSize: '0.825rem' }}>
            {tool.primary_category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{tool.tool_name}</span>
        </nav>

        <div className="tool-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem', alignItems: 'start' }}>
          {/* ── Main Content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Hero */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '2.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                <ToolLogo
                  url={tool.url}
                  icon={tool.icon}
                  favicon_url={tool.favicon_url}
                  size={80}
                />
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>{tool.tool_name}</h1>
                    {tool.open_source && <Badge label="Open Source" variant="emerald" />}
                  </div>
                  {tool.title && (
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: 0 }}>
                      {tool.title}
                    </h2>
                  )}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {tool.category.map((cat) => (
                      <Link key={cat} href={`/category/${slugifyCategory(cat)}`}>
                        <span className="badge badge-violet">{cat}</span>
                      </Link>
                    ))}
                  </div>
                  {/* CTA */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href={`/go/${tool.slug}`}
                      className="btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '7px 16px', fontSize: '0.825rem', gap: '6px' }}
                    >
                      <ExternalLink size={13} /> Visit {tool.tool_name}
                    </a>
                    <Link
                      href={`/compare?tool=${tool.slug}`}
                      className="btn-secondary"
                      style={{ padding: '7px 16px', fontSize: '0.825rem' }}
                    >
                      Compare Tools
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Unified Overview Card ── */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>

              {/* About */}
              <div style={{ padding: '1.75rem 2rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
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
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
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
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Core Features & Capabilities
                    </p>
                    {tool.core_features_rich ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tool.core_features_rich.split('\n').filter(Boolean).map((f, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                             <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>•</span>
                             <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.replace(/^[•-]\s*/, '')}</span>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {tool.core_features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>•</span>
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
                      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                        Best For
                      </p>
                      {cleanBestFor.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: tool.target_user_persona.length > 0 ? '1rem' : 0 }}>
                          {cleanBestFor.map((b, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>•</span>
                              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {tool.target_user_persona.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {tool.target_user_persona.map((p) => (
                            <span key={p} className="badge" style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{p}</span>
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
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Integrations
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {tool.integrations.map((int) => (
                        <span key={int} className="badge" style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{int}</span>
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
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Architecture & Security
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tool.technical_architecture.split('\n').filter(Boolean).map((f, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                           <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>•</span>
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
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                      Pricing Details
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tool.pricing_details.split('\n').filter(Boolean).map((f, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                           <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>•</span>
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
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
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
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives */}
            {alternativeTools.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', paddingLeft: '4px' }}>
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
