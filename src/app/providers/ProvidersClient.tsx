'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, Globe, MapPin, Cpu, ArrowUpRight, Sparkles } from 'lucide-react';
import type { Provider } from '@/lib/providers';

interface ProvidersClientProps {
  providers: Provider[];
  toolCounts: Record<string, number>;
}

const CATEGORY_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Frontier Labs', value: 'frontier' },
  { label: 'Open-Weight', value: 'open-weight' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Specialized', value: 'specialized' },
];

export default function ProvidersClient({ providers, toolCounts }: ProvidersClientProps) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');

  // Matrix live rotation slots (4 visible slots in 2x2 grid)
  const [matrixSlots, setMatrixSlots] = useState<Provider[]>(() => providers.slice(0, 4));
  const [isMatrixPaused, setIsMatrixPaused] = useState(false);

  useEffect(() => {
    if (isMatrixPaused || providers.length < 4) return;

    const interval = setInterval(() => {
      const slotToSwap = Math.floor(Math.random() * 4);

      setMatrixSlots((currentSlots) => {
        const currentSlugs = new Set(currentSlots.map((s) => s.slug));
        const available = providers.filter((p) => !currentSlugs.has(p.slug));
        if (available.length === 0) return currentSlots;

        const nextProvider = available[Math.floor(Math.random() * available.length)];
        const nextSlots = [...currentSlots];
        nextSlots[slotToSwap] = nextProvider;
        return nextSlots;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isMatrixPaused, providers]);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      // 1. Type filter
      if (activeType !== 'all' && p.provider_type !== activeType) return false;

      // 2. Search query
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.headquarters.toLowerCase().includes(q)
      );
    });
  }, [providers, activeType, search]);

  return (
    <>
      <style>{`
        .providers-hero {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .providers-hero {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .providers-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .providers-hero-grid {
            grid-template-columns: 1.15fr 0.85fr;
          }
        }

        .provider-hero-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .provider-matrix-cell {
          height: 115px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 1rem;
          text-decoration: none;
          cursor: pointer;
        }
        .cell-top-left { border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
        .cell-top-right { border-bottom: 1px solid var(--border-subtle); }
        .cell-bot-left { border-right: 1px solid var(--border-subtle); }

        .matrix-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--border-subtle);
          font-size: 16px;
          font-weight: 300;
          font-family: monospace;
          pointer-events: none;
          z-index: 5;
          user-select: none;
        }

        .provider-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 3px 12px;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 180ms ease;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.03);
          color: #3f3f46;
          user-select: none;
        }

        .provider-pill:hover {
          border-color: rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          color: #09090b;
        }

        .provider-pill.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
        }

        [data-theme='dark'] .provider-pill {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #a1a1aa;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }

        [data-theme='dark'] .provider-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        [data-theme='dark'] .provider-pill.active {
          background: #ffffff;
          border-color: #ffffff;
          color: #09090b;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
          margin-bottom: 3.5rem;
        }
        @media (min-width: 640px) {
          .providers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .providers-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .provider-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .provider-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .provider-search-bar {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.925rem;
          outline: none;
          transition: border-color 150ms ease;
        }
        .provider-search-bar:focus {
          border-color: var(--accent-primary);
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem' }}>
        {/* Hero Section Banner */}
        <div className="providers-hero">
          <div className="providers-hero-grid">
            {/* Left Column: Badge, 2-Row Headline, Subtitle, CTAs, Search */}
            <div>
              <div className="monochrome-pill-badge" style={{ marginBottom: '1rem' }}>
                <span>+ Model Intelligence</span>
              </div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.035em', margin: '0 0 0.75rem 0', color: 'var(--text-primary)', lineHeight: 1.15 }}>
                Frontier AI Model Providers
                <br />
                & Research Labs
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.5rem 0', maxWidth: '520px' }}>
                Discover the foundation labs, infrastructure engines, and open-weight research providers powering modern artificial intelligence applications.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <button
                  onClick={() => {
                    const el = document.getElementById('providers-grid-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary"
                  style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  Explore Providers <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </button>
                <Link
                  href="/submit"
                  className="btn-secondary"
                  style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Submit Tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </Link>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', maxWidth: '480px', width: '100%' }}>
                <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search providers (e.g. OpenAI, Anthropic, DeepSeek)..."
                  className="provider-search-bar"
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: 2x2 Matrix with Superhuman-Style Live Rotation */}
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={() => setIsMatrixPaused(true)}
              onMouseLeave={() => setIsMatrixPaused(false)}
            >
              <div className="provider-hero-matrix">
                {matrixSlots.map((p, idx) => {
                  const cellClasses = ['cell-top-left', 'cell-top-right', 'cell-bot-left', ''];
                  const cellClass = cellClasses[idx];
                  const count = toolCounts[p.slug] || 0;

                  return (
                    <Link
                      key={idx}
                      href={`/providers/${p.slug}`}
                      className={`provider-matrix-cell ${cellClass}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={p.slug}
                          initial={{ opacity: 0, y: 6, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.94 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                            flexShrink: 0,
                          }}>
                            <img
                              src={p.logo_url}
                              alt={p.name}
                              width={42}
                              height={42}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                            {p.name}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </Link>
                  );
                })}

                {/* Center Crosshair */}
                <div className="matrix-crosshair">+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Section Anchor */}
        <div id="providers-grid-section" style={{ scrollMarginTop: '100px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveType(tab.value)}
                  className={`provider-pill${activeType === tab.value ? ' active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing {filtered.length} of {providers.length} providers
            </span>
          </div>

          {/* Providers Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No providers found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search terms or filter selection.</p>
            </div>
          ) : (
            <div className="providers-grid">
              {filtered.map((p) => {
                const toolsCount = toolCounts[p.slug] || 0;
                return (
                  <Link key={p.slug} href={`/providers/${p.slug}`} className="provider-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.logo_url}
                          alt={p.name}
                          width={44}
                          height={44}
                          style={{ borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                        />
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                            {p.name}
                          </h3>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            {p.provider_type.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <span className="monochrome-pill-badge-sm">
                        {toolsCount} {toolsCount === 1 ? 'Tool' : 'Tools'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {p.headquarters.split(',')[0]}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        View Models <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
