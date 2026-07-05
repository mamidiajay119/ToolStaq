'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Metadata } from 'next';
import { Search, X, GitCompare, ChevronDown } from 'lucide-react';
import type { Tool } from '@/types/tool';
import { getPricingLabel } from '@/lib/tools';

function CompareCell({ value, isBoolean }: { value: string | boolean | number | null; isBoolean?: boolean }) {
  if (isBoolean) {
    return (
      <div style={{ textAlign: 'center' }}>
        {value ? <span style={{ color: '#6ee7b7', fontSize: '1.1rem' }}>✓</span> : <span style={{ color: '#fda4af', fontSize: '1.1rem' }}>✗</span>}
      </div>
    );
  }
  if (Array.isArray(value)) {
    return <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{(value as string[]).join(', ')}</span>;
  }
  return <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{String(value ?? '—')}</span>;
}

interface CompareTableProps {
  tools: Tool[];
  onRemove: (slug: string) => void;
}

const COMPARE_ROWS = [
  { label: 'Category', key: 'primary_category' },
  { label: 'Pricing Model', key: 'pricing_model' },
  { label: 'Starting Price', key: 'starting_price_usd' },
  { label: 'Complexity', key: 'complexity_level' },
  { label: 'Deployment', key: 'deployment' },
  { label: 'Free Trial', key: 'free_trial', isBoolean: true },
  { label: 'Has API', key: 'has_api', isBoolean: true },
  { label: 'Open Source', key: 'open_source', isBoolean: true },
  { label: 'Time to Value', key: 'time_to_value' },
];

function CompareTable({ tools, onRemove }: CompareTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '600px' }}>
        <thead>
          <tr>
            <th style={{ width: '140px', padding: '0.75rem 1rem', textAlign: 'left', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Feature
            </th>
            {tools.map((tool) => (
              <th key={tool.slug} style={{ padding: '1rem', textAlign: 'center', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{tool.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{tool.tool_name}</span>
                  <button onClick={() => onRemove(tool.slug)} style={{
                    background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                    borderRadius: '6px', color: '#fda4af', cursor: 'pointer', padding: '2px 8px',
                    fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px',
                  }}>
                    <X size={10} /> Remove
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row, i) => (
            <tr key={row.key} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '0.75rem 1rem', fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                {row.label}
              </td>
              {tools.map((tool) => {
                const val = row.key === 'starting_price_usd'
                  ? getPricingLabel(tool)
                  : (tool as any)[row.key];
                return (
                  <td key={tool.slug} style={{ padding: '0.75rem 1rem', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                    <CompareCell value={val} isBoolean={row.isBoolean} />
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={{ padding: '0.75rem 1rem', fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visit</td>
            {tools.map((tool) => (
              <td key={tool.slug} style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                <a href={`/go/${tool.slug}`} target="_blank" rel="noopener" className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'inline-flex' }}>
                  Visit →
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function CompareClient({ tools }: { tools: Tool[] }) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const initialTool = searchParams.get('tool');
    if (initialTool && tools.some(t => t.slug === initialTool) && !selected.includes(initialTool)) {
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
    if (selected.length >= 4) return;
    setSelected([...selected, slug]);
    setSearch('');
  };

  const removeTool = (slug: string) => setSelected(selected.filter((s) => s !== slug));

  return (
    <div className="container-lg" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <GitCompare size={22} style={{ color: 'var(--accent-violet)' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Compare AI Tools</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Select up to 4 tools and compare them side-by-side
        </p>
      </div>

      {/* Search to add tools */}
      {selected.length < 4 && (
        <div style={{ maxWidth: '500px', margin: '0 auto 2rem', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search and add a tool to compare..."
            className="search-input"
            style={{ paddingLeft: '42px', paddingTop: '12px', paddingBottom: '12px', fontSize: '0.9rem' }}
            id="compare-search"
          />
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
              background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
              borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              {searchResults.map((tool) => (
                <button key={tool.slug} onClick={() => addTool(tool.slug)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                  textAlign: 'left', transition: 'background 150ms ease',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ fontSize: '1.2rem' }}>{tool.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tool.tool_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.primary_category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selected.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
          <p>Search and add at least 2 tools above to start comparing</p>
        </div>
      ) : selected.length === 1 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <p>Add at least one more tool to compare</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <CompareTable tools={selectedTools} onRemove={removeTool} />
        </div>
      )}
    </div>
  );
}
