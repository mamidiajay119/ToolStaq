'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
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
      <div className="inner-hero">
        <h1>Compare AI Tools</h1>
        <p>Select up to 3 tools and compare them side-by-side</p>
      </div>

      <div className="container-xl" style={{ paddingBottom: '3rem' }}>

      {/* Two-panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>

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
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                {searchResults.map((tool, i) => (
                  <button
                    key={tool.slug}
                    onMouseDown={() => addTool(tool.slug)}
                    style={{
                      display: 'block', width: '100%', padding: '9px 12px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      borderBottom: i < searchResults.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
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
          border: '1px solid var(--border-subtle)',
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
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
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
                        borderLeft: '1px solid var(--border-subtle)',
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
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
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
                            borderLeft: '1px solid var(--border-subtle)',
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
                      <td key={tool.slug} style={{ padding: '1rem 1.25rem', borderLeft: '1px solid var(--border-subtle)' }}>
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
