'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';

const PRICING_MODELS = ['freemium', 'subscription', 'usage-based', 'one-time', 'custom pricing'];
const COMPLEXITY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DEPLOYMENT_OPTIONS = ['Cloud', 'Self-hosted', 'Desktop', 'API'];

function FilterDropdown({ title, badgeCount, children }: { title: string, badgeCount: number, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary"
        style={{ padding: '5px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {title}
        {badgeCount > 0 && (
          <span style={{
            background: 'var(--accent-primary)', color: 'white',
            borderRadius: '99px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 700,
          }}>
            {badgeCount}
          </span>
        )}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '6px', zIndex: 50,
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '16px', padding: '16px', minWidth: '220px',
          boxShadow: 'var(--shadow-hover)', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 0' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="filter-checkbox"
      />
      <span style={{ fontSize: '0.85rem', color: checked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
    </label>
  );
}

export default function BrowseToolsClient({ tools, allCategories }: { tools: Tool[]; allCategories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedComplexity, setSelectedComplexity] = useState<string[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<string[]>([]);
  const [freeTrialOnly, setFreeTrialOnly] = useState(false);
  const [apiOnly, setApiOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const filtered = useMemo(() => {
    let result = tools;
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter((t) =>
        t.tool_name.toLowerCase().includes(q) ||
        t.primary_category.toLowerCase().includes(q) ||
        t.category.some((c) => c.toLowerCase().includes(q)) ||
        t.best_for.some((b) => b.toLowerCase().includes(q)) ||
        t.decision_summary.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((t) => t.category.some((c) => selectedCategories.includes(c)));
    }
    if (selectedPricing.length > 0) {
      result = result.filter((t) => selectedPricing.includes(t.pricing_model));
    }
    if (selectedComplexity.length > 0) {
      result = result.filter((t) => selectedComplexity.includes(t.complexity_level));
    }
    if (selectedDeployment.length > 0) {
      result = result.filter((t) => selectedDeployment.includes(t.deployment));
    }
    if (freeTrialOnly) result = result.filter((t) => t.free_trial);
    if (apiOnly) result = result.filter((t) => t.has_api);
    if (openSourceOnly) result = result.filter((t) => t.open_source);
    return result;
  }, [tools, search, selectedCategories, selectedPricing, selectedComplexity, selectedDeployment, freeTrialOnly, apiOnly, openSourceOnly]);

  const paginated = useMemo(() => filtered.slice(0, page * PER_PAGE), [filtered, page]);

  const activeFilterCount = selectedCategories.length + selectedPricing.length + selectedComplexity.length +
    selectedDeployment.length + (freeTrialOnly ? 1 : 0) + (apiOnly ? 1 : 0) + (openSourceOnly ? 1 : 0);

  const activeNonCategoryCount = activeFilterCount - selectedCategories.length;

  const clearAll = () => {
    setSelectedCategories([]); setSelectedPricing([]); setSelectedComplexity([]);
    setSelectedDeployment([]); setFreeTrialOnly(false); setApiOnly(false); setOpenSourceOnly(false);
    setSearch(''); setPage(1);
  };

  const toggleArr = (arr: string[], val: string, setArr: (v: string[]) => void) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
    setPage(1);
  };

  return (
    <div style={{ minHeight: '80vh', padding: '1rem 0 4rem' }}>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top Search & Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '600px', width: '100%' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search tools, categories, use cases..."
            className="search-input"
            style={{ paddingLeft: '36px', paddingRight: search ? '36px' : '16px', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.9rem' }}
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Chips Row */}
        <div className="hide-scroll" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => { setSelectedCategories([]); setPage(1); }}
            className={selectedCategories.length === 0 ? "btn-primary" : "btn-secondary"}
            style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            All Categories
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleArr(selectedCategories, cat, setSelectedCategories)}
              className={selectedCategories.includes(cat) ? "btn-primary" : "btn-secondary"}
              style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              {cat.replace('AI ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdowns Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          
          <FilterDropdown title="Pricing" badgeCount={selectedPricing.length}>
            {PRICING_MODELS.map((m) => (
              <CheckItem key={m} label={m.charAt(0).toUpperCase() + m.slice(1)} checked={selectedPricing.includes(m)} onChange={() => toggleArr(selectedPricing, m, setSelectedPricing)} />
            ))}
          </FilterDropdown>

          <FilterDropdown title="Complexity" badgeCount={selectedComplexity.length}>
            {COMPLEXITY_LEVELS.map((l) => (
              <CheckItem key={l} label={l} checked={selectedComplexity.includes(l)} onChange={() => toggleArr(selectedComplexity, l, setSelectedComplexity)} />
            ))}
          </FilterDropdown>

          <FilterDropdown title="Deployment" badgeCount={selectedDeployment.length}>
            {DEPLOYMENT_OPTIONS.map((d) => (
              <CheckItem key={d} label={d} checked={selectedDeployment.includes(d)} onChange={() => toggleArr(selectedDeployment, d, setSelectedDeployment)} />
            ))}
          </FilterDropdown>

          <FilterDropdown title="Features" badgeCount={(freeTrialOnly ? 1 : 0) + (apiOnly ? 1 : 0) + (openSourceOnly ? 1 : 0)}>
            <CheckItem label="Free Trial Available" checked={freeTrialOnly} onChange={(v) => { setFreeTrialOnly(v); setPage(1); }} />
            <CheckItem label="Has API" checked={apiOnly} onChange={(v) => { setApiOnly(v); setPage(1); }} />
            <CheckItem label="Open Source" checked={openSourceOnly} onChange={(v) => { setOpenSourceOnly(v); setPage(1); }} />
          </FilterDropdown>

          {activeFilterCount > 0 && (
            <button onClick={clearAll} className="btn-ghost" style={{ fontSize: '0.85rem' }}>
              Clear all filters
            </button>
          )}
        </div>

        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{filtered.length.toLocaleString()}</strong> tools
        </span>
      </div>

      {/* Active Non-Category Filter Badges */}
      {activeNonCategoryCount > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {selectedPricing.map((p) => (
            <span key={p} onClick={() => toggleArr(selectedPricing, p, setSelectedPricing)} style={{ cursor: 'pointer', padding: '4px 10px' }} className="badge badge-slate">
              {p} <X size={12} />
            </span>
          ))}
          {selectedComplexity.map((c) => (
            <span key={c} onClick={() => toggleArr(selectedComplexity, c, setSelectedComplexity)} style={{ cursor: 'pointer', padding: '4px 10px' }} className="badge badge-slate">
              {c} <X size={12} />
            </span>
          ))}
          {selectedDeployment.map((d) => (
            <span key={d} onClick={() => toggleArr(selectedDeployment, d, setSelectedDeployment)} style={{ cursor: 'pointer', padding: '4px 10px' }} className="badge badge-slate">
              {d} <X size={12} />
            </span>
          ))}
          {freeTrialOnly && (
            <span onClick={() => setFreeTrialOnly(false)} style={{ cursor: 'pointer', padding: '4px 10px' }} className="badge badge-slate">
              Free Trial <X size={12} />
            </span>
          )}
          {apiOnly && (
            <span onClick={() => setApiOnly(false)} style={{ cursor: 'pointer', padding: '4px 10px' }} className="badge badge-slate">
              Has API <X size={12} />
            </span>
          )}
          {openSourceOnly && (
            <span onClick={() => setOpenSourceOnly(false)} style={{ cursor: 'pointer', padding: '4px 10px' }} className="badge badge-slate">
              Open Source <X size={12} />
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No tools found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try adjusting your filters or search query.</p>
          <button onClick={clearAll} className="btn-secondary" style={{ fontSize: '0.85rem' }}>Clear all filters</button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '14px',
            marginBottom: '2rem',
          }}>
            {paginated.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} rank={i < 3 && page === 1 ? i + 1 : undefined} />
            ))}
          </div>

          {paginated.length < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={() => setPage((p) => p + 1)} className="btn-secondary" style={{ padding: '12px 32px' }}>
                Load more ({filtered.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
