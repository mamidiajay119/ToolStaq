'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ChevronDown, ChevronUp, Sparkles, ChevronRight } from 'lucide-react';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';
import Link from 'next/link';
import ToolLogo from '@/components/tools/ToolLogo';
import ToolsHeroBanner from '@/components/tools/ToolsHeroBanner';

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

  // Changes only when the filtered set changes (not on load-more).
  // Using this as a key on the motion container re-mounts it, replaying the stagger.
  const animationKey = useMemo(
    () => `${filtered.length}-${filtered[0]?.slug ?? ''}`,
    [filtered]
  );

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
        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          flex-wrap: nowrap;
          white-space: nowrap;
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-pills-row::-webkit-scrollbar {
          display: none;
        }

        .category-pill-btn {
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
        }

        .category-pill-btn:hover {
          border-color: rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          color: #09090b;
        }

        .category-pill-btn.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
        }

        [data-theme='dark'] .category-pill-btn {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          color: #a1a1aa;
        }
        [data-theme='dark'] .category-pill-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.2);
          color: #f4f4f5;
        }
        [data-theme='dark'] .category-pill-btn.active {
          background: #ffffff;
          border-color: #ffffff;
          color: #09090b;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
        {/* Animated Integration Grid Hero Banner (Calendly/Linear Style) */}
        <ToolsHeroBanner
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          totalCount={tools.length}
        />

        {/* Top Picks Marquee — ALWAYS displayed irrespective of category selected */}
        {recommendedTools.length > 0 && !search.trim() && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '8px' }}>
              <div className="monochrome-pill-badge-sm" style={{ marginBottom: 0 }}>
                <span>+ Top Picks</span>
              </div>
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

        {/* Centered Category Pills Row matching reference screenshot */}
        <div id="tools-directory-grid" className="category-pills-row">
          <button
            onClick={() => { setSelectedCategories([]); setPage(1); }}
            className={`category-pill-btn ${selectedCategories.length === 0 ? "active" : ""}`}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleArr(selectedCategories, cat, setSelectedCategories)}
              className={`category-pill-btn ${selectedCategories.includes(cat) ? "active" : ""}`}
            >
              {cat}
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
          background: var(--bg-secondary);
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
        [data-theme='dark'] .top-picks-marquee-capsule {
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
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
            <span key={p} onClick={() => toggleArr(selectedPricing, p, setSelectedPricing)} style={{ cursor: 'pointer' }} className="monochrome-pill-badge-sm">
              {p} <X size={12} />
            </span>
          ))}
          {selectedComplexity.map((c) => (
            <span key={c} onClick={() => toggleArr(selectedComplexity, c, setSelectedComplexity)} style={{ cursor: 'pointer' }} className="monochrome-pill-badge-sm">
              {c} <X size={12} />
            </span>
          ))}
          {selectedDeployment.map((d) => (
            <span key={d} onClick={() => toggleArr(selectedDeployment, d, setSelectedDeployment)} style={{ cursor: 'pointer' }} className="monochrome-pill-badge-sm">
              {d} <X size={12} />
            </span>
          ))}
          {freeTrialOnly && (
            <span onClick={() => setFreeTrialOnly(false)} style={{ cursor: 'pointer' }} className="monochrome-pill-badge-sm">
              Free Trial <X size={12} />
            </span>
          )}
          {apiOnly && (
            <span onClick={() => setApiOnly(false)} style={{ cursor: 'pointer' }} className="monochrome-pill-badge-sm">
              Has API <X size={12} />
            </span>
          )}
          {openSourceOnly && (
            <span onClick={() => setOpenSourceOnly(false)} style={{ cursor: 'pointer' }} className="monochrome-pill-badge-sm">
              Open Source <X size={12} />
            </span>
          )}
          <button
            onClick={() => {
              setSelectedPricing([]);
              setSelectedComplexity([]);
              setSelectedDeployment([]);
              setFreeTrialOnly(false);
              setApiOnly(false);
              setOpenSourceOnly(false);
            }}
            style={{
              background: 'none', border: 'none', color: 'var(--accent-primary)',
              fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline',
              padding: '2px 6px',
            }}
          >
            Clear non-category filters
          </button>
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
          <motion.div
            key={animationKey}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '14px',
              marginBottom: '2rem',
            }}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.045, delayChildren: 0 } },
            }}
          >
            {paginated.map((tool, i) => (
              <motion.div
                key={tool.slug}
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.97 },
                  show: {
                    opacity: 1, y: 0, scale: 1,
                    // Cap stagger so the 25th+ card doesn't wait forever
                    transition: {
                      duration: 0.38,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i, 12) * 0.045,
                    },
                  },
                }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>

          {paginated.length < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '0.5rem' }}>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary"
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                }}
              >
                Load more <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </>
  );
}
