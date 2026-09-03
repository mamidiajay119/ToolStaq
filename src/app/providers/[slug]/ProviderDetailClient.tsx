'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Globe, MapPin, ExternalLink, Cpu, Sparkles, ChevronRight, Layers } from 'lucide-react';
import type { Provider } from '@/lib/providers';
import type { OpenRouterModel } from '@/lib/openrouter';
import type { Tool } from '@/types/tool';
import ToolCard from '@/components/tools/ToolCard';

interface ProviderDetailClientProps {
  provider: Provider;
  liveModels: OpenRouterModel[];
  tools: Tool[];
}

export default function ProviderDetailClient({ provider, liveModels, tools }: ProviderDetailClientProps) {
  const [visibleModelsCount, setVisibleModelsCount] = useState(8);
  const [visibleToolsCount, setVisibleToolsCount] = useState(8);

  const paginatedModels = useMemo(() => liveModels.slice(0, visibleModelsCount), [liveModels, visibleModelsCount]);
  const paginatedTools = useMemo(() => tools.slice(0, visibleToolsCount), [tools, visibleToolsCount]);

  return (
    <>
      <style>{`
        .provider-detail-hero {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.5rem 2.75rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .provider-detail-hero {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .provider-hero-top-badge {
          position: absolute;
          top: 2.25rem;
          right: 2.5rem;
          z-index: 5;
        }
        @media (max-width: 640px) {
          .provider-detail-hero { padding: 2rem 1.5rem; }
          .provider-hero-top-badge {
            position: static;
            margin-bottom: 0.75rem;
          }
        }

        .tool-category-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 12px;
          border-radius: 99px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .models-spec-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 14px;
        }
        @media (min-width: 768px) {
          .models-spec-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .model-spec-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        }
        .model-spec-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
          margin-bottom: 2rem;
        }
        @media (min-width: 640px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .tools-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '3.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.25rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <Link href="/providers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Providers</Link>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{provider.name}</span>
        </nav>

        {/* Hero Card */}
        <div className="provider-detail-hero">
          {/* Top Right Status Badge */}
          <div className="provider-hero-top-badge">
            <span className="monochrome-pill-badge">
              <span>+ {provider.provider_type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Logo */}
            <img
              src={provider.logo_url}
              alt={provider.name}
              width={76}
              height={76}
              style={{ borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              {/* Title */}
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.035em', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                {provider.name}
              </h1>

              {/* Subtitle / Description directly below title */}
              <p style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text-secondary)', margin: '0 0 1.15rem 0', lineHeight: 1.55, maxWidth: '850px' }}>
                {provider.description}
              </p>

              {/* HQ location tag pill */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <span className="tool-category-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {provider.headquarters}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={provider.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    fontSize: '0.90rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                  }}
                >
                  Visit {provider.name.split(' ')[0]} <ChevronRight size={15} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Live Models Auto-Synced from OpenRouter */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
            <div className="monochrome-pill-badge-sm">
              <span>+ Active Models</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Active Model Families ({liveModels.length})
            </h2>
          </div>

          {liveModels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No active OpenRouter endpoint models currently listed for this provider.
            </div>
          ) : (
            <>
              <div className="models-spec-grid">
                {paginatedModels.map((m) => {
                  const cleanName = (m.name || m.id.split('/')[1] || '').replace(/^[^:]+:\s*/, '').trim();
                  const promptPrice = m.pricing?.prompt ? (parseFloat(m.pricing.prompt) * 1000000) : 0;
                  const completionPrice = m.pricing?.completion ? (parseFloat(m.pricing.completion) * 1000000) : 0;
                  const isFree = promptPrice === 0 && completionPrice === 0;

                  // Humanize modality string
                  let modalityLabel = m.architecture?.modality || '';
                  if (modalityLabel.includes('image') || modalityLabel.includes('multimodal')) {
                    modalityLabel = 'Multimodal / Vision';
                  } else if (modalityLabel.includes('audio')) {
                    modalityLabel = 'Audio / Speech';
                  } else if (modalityLabel) {
                    modalityLabel = 'Text Model';
                  }

                  return (
                    <div key={m.id} className="model-spec-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                            {cleanName}
                          </h3>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {m.id}
                          </span>
                        </div>

                        {modalityLabel && (
                          <span className="monochrome-pill-badge-sm" style={{ fontSize: '0.68rem', flexShrink: 0 }}>
                            {modalityLabel}
                          </span>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingTop: '10px',
                        marginTop: 'auto',
                        borderTop: '1px solid var(--border-subtle)',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        flexWrap: 'wrap'
                      }}>
                        {m.context_length && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Cpu size={13} style={{ opacity: 0.7 }} />
                            {(m.context_length / 1000).toFixed(0)}k context
                          </span>
                        )}

                        <span style={{ marginLeft: 'auto', fontWeight: 600, color: isFree ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {isFree ? 'Free / Open' : `$${promptPrice < 0.01 ? promptPrice.toFixed(4) : promptPrice.toFixed(2)} / 1M in`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {liveModels.length > visibleModelsCount && (
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button
                    onClick={() => setVisibleModelsCount((prev) => prev + 8)}
                    className="btn-secondary"
                    style={{ padding: '10px 28px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    Load more <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Section 2: Ecosystem Tools */}
        <div style={{ marginTop: '3.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
          <div className="monochrome-pill-badge-sm">
            <span>+ Ecosystem</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Tools Powered by or Integrated with {provider.name} ({tools.length})
          </h2>
        </div>

        {tools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No linked tools yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Tools built on this provider will appear here as they are indexed.</p>
          </div>
        ) : (
          <>
            <div className="tools-grid">
              {paginatedTools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>

            {tools.length > visibleToolsCount && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setVisibleToolsCount((prev) => prev + 8)}
                  className="btn-secondary"
                  style={{ padding: '10px 28px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  Load more <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
