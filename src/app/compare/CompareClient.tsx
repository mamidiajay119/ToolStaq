'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { X, Search, ChevronRight, Plus, Sparkles, Scale, ArrowLeftRight } from 'lucide-react';
import type { Tool } from '@/types/tool';
import { getPricingLabel } from '@/lib/tools';
import ToolLogo from '@/components/tools/ToolLogo';

const COMPARE_ROWS = [
  { label: 'Description',    key: 'title' },
  { label: 'Category',       key: 'primary_category' },
  { label: 'Pricing',        key: 'pricing_model' },
  { label: 'Starting Price', key: 'starting_price_usd' },
  { label: 'Complexity',     key: 'complexity_level' },
  { label: 'Deployment',     key: 'deployment' },
  { label: 'Free Trial',     key: 'free_trial',   isBoolean: true },
  { label: 'Has API',        key: 'has_api',       isBoolean: true },
  { label: 'Open Source',    key: 'open_source',   isBoolean: true },
  { label: 'Time to Value',  key: 'time_to_value' },
];

function BooleanCell({ value }: { value: boolean }) {
  return (
    <span style={{ fontSize: '0.85rem', color: value ? '#6ee7b7' : 'var(--text-muted)', fontWeight: 500 }}>
      {value ? 'Yes' : 'No'}
    </span>
  );
}

export default function CompareClient({ tools }: { tools: Tool[] }) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const presets = useMemo(() => {
    const pairs = [
      { name1: 'ChatGPT', name2: 'Claude', label: 'ChatGPT vs Claude' },
      { name1: 'Cursor', name2: 'VS Code', label: 'Cursor vs VS Code' },
      { name1: 'v0', name2: 'Bolt.new', label: 'v0 vs Bolt.new' },
    ];
    
    return pairs.map(p => {
      const t1 = tools.find(t => t.tool_name.toLowerCase().includes(p.name1.toLowerCase()) || t.slug.includes(p.name1.toLowerCase()));
      const t2 = tools.find(t => t.tool_name.toLowerCase().includes(p.name2.toLowerCase()) || t.slug.includes(p.name2.toLowerCase()) || (p.name2 === 'VS Code' && t.slug.includes('vs-code')));
      if (t1 && t2) {
        return { label: p.label, slugs: [t1.slug, t2.slug] };
      }
      return null;
    }).filter(Boolean) as { label: string; slugs: string[] }[];
  }, [tools]);

  const chatgptTool = useMemo(() => {
    return tools.find(t => t.slug === 'chatgpt' || t.tool_name.toLowerCase().includes('chatgpt'));
  }, [tools]);

  const claudeTool = useMemo(() => {
    return tools.find(t => t.slug === 'claude' || t.tool_name.toLowerCase().includes('claude'));
  }, [tools]);

  useEffect(() => {
    const initialTool = searchParams.get('tool');
    if (initialTool && tools.some(t => t.slug === initialTool)) {
      setSelected(prev => prev.includes(initialTool) ? prev : [...prev, initialTool]);
    }
  }, [searchParams, tools]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return tools.filter(
      (t) => !selected.includes(t.slug) && (
        t.tool_name.toLowerCase().includes(q) ||
        t.primary_category.toLowerCase().includes(q)
      )
    ).slice(0, 8);
  }, [tools, search, selected]);

  const selectedTools = selected.map((s) => tools.find((t) => t.slug === s)!).filter(Boolean);

  const addTool = (slug: string) => {
    if (selected.length >= 3) return;
    setSelected(prev => [...prev, slug]);
    setSearch('');
    setFocused(false);
  };

  const removeTool = (slug: string) => setSelected(selected.filter((s) => s !== slug));

  return (
    <>
      <style>{`
        .compare-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .compare-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .compare-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .compare-hero-grid { grid-template-columns: 1.15fr 0.85fr; }
        }

        .compare-pill-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 99px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.03);
          font-size: 0.70rem;
          font-weight: 500;
          color: #18181b;
          margin-bottom: 0.85rem;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .compare-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .compare-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .compare-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 500px;
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
        {/* Animated Compare Hero Card Banner */}
        <div className="compare-hero-card">
          <div className="compare-hero-grid">
            {/* Left Column: Badge, Headline, Subtitle, CTAs */}
            <div>
              <div className="compare-pill-badge">
                <span>+ Tool Comparison</span>
              </div>

              <h1 className="compare-hero-heading">
                Compare AI tools<br />
                side-by-side
              </h1>

              <p className="compare-hero-sub">
                Evaluate pricing models, starting costs, complexity levels, API access, and deployment options side-by-side to make the right software choice.
              </p>

              {/* Action CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const selectorEl = document.getElementById('compare-selector-box');
                    if (selectorEl) selectorEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Compare tools <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </button>
                <a
                  href="/tools"
                  className="btn-secondary"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Explore directory <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </a>
              </div>
            </div>

            {/* Right Column: Comparison Preview Grid with VS badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Tool 1 Card */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', left: '10px', width: '170px', height: '120px',
                    borderRadius: '16px', background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (chatgptTool?.slug && claudeTool?.slug) setSelected([chatgptTool.slug, claudeTool.slug]);
                  }}
                >
                  <ToolLogo
                    url={chatgptTool?.url || 'https://chatgpt.com'}
                    icon={chatgptTool?.icon || '🤖'}
                    favicon_url={chatgptTool?.favicon_url}
                    size={38}
                    borderRadius={10}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>ChatGPT</span>
                </motion.div>

                {/* VS Badge in the center */}
                <div style={{
                  position: 'absolute', zIndex: 5,
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'var(--accent-primary)', color: '#FFFFFF',
                  fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.04em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                  border: '3px solid var(--bg-card)',
                }}>
                  VS
                </div>

                {/* Tool 2 Card */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  style={{
                    position: 'absolute', right: '10px', width: '170px', height: '120px',
                    borderRadius: '16px', background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (chatgptTool?.slug && claudeTool?.slug) setSelected([chatgptTool.slug, claudeTool.slug]);
                  }}
                >
                  <ToolLogo
                    url={claudeTool?.url || 'https://claude.ai'}
                    icon={claudeTool?.icon || '🧠'}
                    favicon_url={claudeTool?.favicon_url}
                    size={38}
                    borderRadius={10}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Claude</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

      {/* Two-panel layout */}
      <div id="compare-selector-box" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left panel: selection ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '80px' }}>

          {/* Search box */}
          {selected.length < 3 && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search tools…"
              className="search-input"
              style={{ fontSize: '0.85rem', padding: '9px 12px', width: '100%', boxSizing: 'border-box' }}
              id="compare-search"
            />
            {(focused && searchResults.length > 0) && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                background: 'var(--bg-card)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
                borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                {searchResults.map((tool, i) => (
                  <button
                    key={tool.slug}
                    onMouseDown={() => addTool(tool.slug)}
                    style={{
                      display: 'block', width: '100%', padding: '9px 12px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      borderBottom: i < searchResults.length - 1 ? 'var(--border-width, 1px) solid var(--border-subtle)' : 'none',
                      textAlign: 'left', transition: 'background 120ms',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)' }}>{tool.tool_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{tool.primary_category}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Selected tool cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedTools.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                No tools selected yet.
              </p>
            )}
            {selectedTools.map((tool) => (
              <div
                key={tool.slug}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--bg-card)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
                  borderRadius: '10px', padding: '10px 12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)' }}>{tool.tool_name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{tool.primary_category}</div>
                </div>
                <button
                  onClick={() => removeTool(tool.slug)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '2px', borderRadius: '4px',
                    display: 'flex', alignItems: 'center',
                    transition: 'color 120ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fda4af')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {selected.length < 3 && selected.length > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {3 - selected.length} slot{3 - selected.length !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* ── Right panel: comparison table ── */}
        <div style={{
          background: 'var(--bg-card)',
          border: 'var(--border-width, 1px) solid var(--border-subtle)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}>
          {selectedTools.length < 2 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.875rem' }}>
                {selectedTools.length === 0
                  ? 'Search and select at least 2 tools to start comparing.'
                  : 'Add one more tool to start comparing.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)' }}>
                    <th style={{
                      width: '18%', padding: '1rem 1.25rem', textAlign: 'left',
                      fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      Feature
                    </th>
                    {selectedTools.map((tool) => (
                      <th key={tool.slug} style={{
                        padding: '1rem 1.25rem', textAlign: 'left',
                        borderLeft: 'var(--border-width, 1px) solid var(--border-subtle)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ToolLogo url={tool.url} icon={tool.icon} favicon_url={tool.favicon_url} size={42} />
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {tool.tool_name}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.key}
                      style={{ borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)' }}
                    >
                      <td style={{
                        padding: '0.875rem 1.25rem',
                        fontSize: '0.8rem', color: 'var(--text-muted)',
                        fontWeight: 500, whiteSpace: 'nowrap',
                      }}>
                        {row.label}
                      </td>
                      {selectedTools.map((tool) => {
                        const val = row.key === 'starting_price_usd'
                          ? getPricingLabel(tool)
                          : (tool as any)[row.key];
                        return (
                          <td key={tool.slug} style={{
                            padding: '0.875rem 1.25rem',
                            borderLeft: 'var(--border-width, 1px) solid var(--border-subtle)',
                            fontSize: '0.825rem', color: 'var(--text-secondary)',
                          }}>
                            {row.isBoolean
                              ? <BooleanCell value={!!val} />
                              : Array.isArray(val)
                                ? (val as string[]).join(', ')
                                : String(val ?? '—')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Visit row */}
                  <tr>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Visit
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} style={{ padding: '1rem 1.25rem', borderLeft: 'var(--border-width, 1px) solid var(--border-subtle)' }}>
                        <a
                          href={`/go/${tool.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ fontSize: '0.775rem', padding: '6px 14px', display: 'inline-flex' }}
                        >
                          Visit →
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  </>
  );
}
