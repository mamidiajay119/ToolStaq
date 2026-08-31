'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';
import Link from 'next/link';
import ToolLogo from '@/components/tools/ToolLogo';

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
          background: 'var(--bg-card)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
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

  const recommendedTools = useMemo(() => {
    return tools.filter((t) => t.is_recommended);
  }, [tools]);

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
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hero-search-input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .hero-search-input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
        .hero-tag-btn:hover {
          background: rgba(255, 255, 255, 0.22) !important;
        }
        [data-theme='dark'] .hero-search-input {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: var(--text-primary) !important;
        }
        [data-theme='dark'] .hero-search-input::placeholder {
          color: var(--text-muted) !important;
        }
        [data-theme='dark'] .hero-search-input:focus {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        [data-theme='dark'] .hero-tag-btn {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: var(--text-secondary) !important;
        }
        [data-theme='dark'] .hero-tag-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: var(--text-primary) !important;
        }
        [data-theme='dark'] .hero-stats-row {
          border-top-color: rgba(255, 255, 255, 0.06) !important;
        }
        [data-theme='dark'] .hero-stats-row span:first-child {
          color: var(--text-primary) !important;
        }
        [data-theme='dark'] .hero-stats-row span:last-child {
          color: var(--text-secondary) !important;
        }
      `}</style>

      {/* Expanded Inner Hero Banner */}
      <div className="inner-hero" style={{ padding: '4.5rem 1.5rem 5.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>AI Tools</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Explore hand-curated AI tools for your workflow.</p>
        
        {/* Search box inside Hero */}
        <div style={{ position: 'relative', maxWidth: '580px', width: '100%', margin: '1.75rem auto 1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search 2,729+ tools, categories, use cases..."
            className="hero-search-input"
            style={{
              width: '100%',
              paddingLeft: '44px',
              paddingRight: search ? '40px' : '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: '0.95rem',
              borderRadius: '14px',
              border: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'all 150ms ease',
            }}
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Trending tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Trending:</span>
          {['Voice Cloning', 'SEO Writing', 'Code Assistant', 'Video Creator'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setSearch(tag); setPage(1); }}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.18)',
                borderRadius: '99px',
                padding: '3px 10px',
                fontSize: '0.72rem',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'background 150ms ease',
              }}
              className="hero-tag-btn"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Platform Stats Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          borderTop: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.15)',
          paddingTop: '1.75rem',
          maxWidth: '580px',
          width: '100%',
          margin: '0.5rem auto 0',
        }} className="hero-stats-row">
          {[
            { number: '2,729+', label: 'AI Tools' },
            { number: '96', label: 'Categories' },
            { number: 'Free & Paid', label: 'Pricing Options' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {stat.number}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '3px' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-xl" style={{ paddingBottom: '4rem' }}>

        {/* Top Picks Marquee — ABOVE category chips for best UX flow */}
        {recommendedTools.length > 0 && activeFilterCount === 0 && !search.trim() && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Top Picks
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '99px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: 'var(--border-width, 1px) solid rgba(249, 115, 22, 0.25)',
                  color: 'var(--accent-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Featured
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Handpicked top-tier AI tools
              </span>
            </div>

            <div className="top-picks-marquee-container">
              <div className="top-picks-marquee-track">
                {(recommendedTools.length < 8
                  ? [...recommendedTools, ...recommendedTools, ...recommendedTools, ...recommendedTools]
                  : [...recommendedTools, ...recommendedTools]
                ).map((tool, idx) => (
                  <Link
                    key={`${tool.slug}-${idx}`}
                    href={`/tools/${tool.slug}`}
                    className="top-picks-marquee-capsule"
                  >
                    <ToolLogo
                      url={tool.url}
                      icon={tool.icon}
                      favicon_url={tool.favicon_url}
                      size={34}
                      borderRadius={9}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {tool.tool_name}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {tool.primary_category.replace('AI ', '')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Chips Row (Horizontal Scrollable) */}
        <div className="hide-scroll" style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto', 
          paddingBottom: '1.5rem', 
          marginBottom: '1.5rem', 
          borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)' 
        }}>
          <button
            onClick={() => { setSelectedCategories([]); setPage(1); }}
            className={selectedCategories.length === 0 ? "btn-primary" : "btn-secondary"}
            style={{ padding: '6px 16px', borderRadius: '99px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            All Categories
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleArr(selectedCategories, cat, setSelectedCategories)}
              className={selectedCategories.includes(cat) ? "btn-primary" : "btn-secondary"}
              style={{ padding: '6px 16px', borderRadius: '99px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              {cat.replace('AI ', '')}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          {/* Dropdowns Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Tools count display if filtered */}
        {(activeFilterCount > 0 || search.trim() !== '') && (
          <div style={{ marginBottom: '1.5rem', marginTop: '-1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{filtered.length.toLocaleString()}</strong> tools found
            </span>
          </div>
        )}

      {/* Marquee CSS — shared styles */}
      <style>{`
        .top-picks-marquee-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          padding: 6px 0;
          mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
        }
        .top-picks-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: topPicksMarquee 35s linear infinite;
        }
        .top-picks-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes topPicksMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .top-picks-marquee-capsule {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 14px;
          padding: 9px 16px;
          text-decoration: none;
          min-width: 210px;
          max-width: 240px;
          flex-shrink: 0;
          transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
          box-shadow: var(--shadow-card);
        }
        .top-picks-marquee-capsule:hover {
          border-color: var(--accent-primary) !important;
          box-shadow: var(--shadow-hover) !important;
          transform: translateY(-2px);
        }
      `}</style>

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
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: 'var(--border-width, 1px) solid var(--border-subtle)' }}>
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
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>

          {paginated.length < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '0.5rem' }}>
              <button onClick={() => setPage((p) => p + 1)} className="btn-secondary" style={{ padding: '8px 24px', borderRadius: '12px' }}>
                Load more
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </>
  );
}
