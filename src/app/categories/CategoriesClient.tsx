'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, Plus, Sparkles, Code2, Bot, Zap, Palette, Video, Music, Wrench } from 'lucide-react';
import { slugifyCategory } from '@/lib/tools';
import { CATEGORY_SHORT_DESCRIPTIONS } from '@/lib/category-content';
import CategoryIcon from '@/components/ui/CategoryIcon';

interface CategoriesClientProps {
  categories: string[];
  counts: Record<string, number>;
}

const PER_PAGE = 24;

export default function CategoriesClient({ categories, counts }: CategoriesClientProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Pool of top featured categories for matrix live rotation
  const FEATURED_CATEGORIES = useMemo(() => [
    { name: 'AI Coding', icon: <Code2 size={20} color="#8b5cf6" /> },
    { name: 'AI Agents', icon: <Bot size={20} color="#0891b2" /> },
    { name: 'Frontier Models', icon: <Sparkles size={20} color="#059669" /> },
    { name: 'AI Productivity', icon: <Zap size={20} color="#d97706" /> },
    { name: 'AI Design & UI', icon: <Palette size={20} color="#ec4899" /> },
    { name: 'AI Video & Motion', icon: <Video size={20} color="#3b82f6" /> },
    { name: 'AI Audio & Music', icon: <Music size={20} color="#10b981" /> },
    { name: 'Developer Tools', icon: <Wrench size={20} color="#6366f1" /> },
  ], []);

  const [matrixSlots, setMatrixSlots] = useState(() => FEATURED_CATEGORIES.slice(0, 4));
  const [isMatrixPaused, setIsMatrixPaused] = useState(false);

  useEffect(() => {
    if (isMatrixPaused || FEATURED_CATEGORIES.length < 4) return;

    const interval = setInterval(() => {
      const slotToSwap = Math.floor(Math.random() * 4);

      setMatrixSlots((currentSlots) => {
        const currentNames = new Set(currentSlots.map((s) => s.name));
        const available = FEATURED_CATEGORIES.filter((c) => !currentNames.has(c.name));
        if (available.length === 0) return currentSlots;

        const nextCat = available[Math.floor(Math.random() * available.length)];
        const nextSlots = [...currentSlots];
        nextSlots[slotToSwap] = nextCat;
        return nextSlots;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isMatrixPaused, FEATURED_CATEGORIES]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(cat => 
      cat.toLowerCase().includes(q) || 
      (CATEGORY_SHORT_DESCRIPTIONS[cat] && CATEGORY_SHORT_DESCRIPTIONS[cat].toLowerCase().includes(q))
    );
  }, [search, categories]);

  const paginated = useMemo(() => {
    return filtered.slice(0, page * PER_PAGE);
  }, [filtered, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <>
      <style>{`
        .categories-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .categories-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .categories-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .categories-hero-grid { grid-template-columns: 1.15fr 0.85fr; }
        }

        .categories-pill-badge {
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
        [data-theme='dark'] .categories-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .categories-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .categories-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 500px;
        }

        .categories-search-bar {
          width: 100%;
          padding: 10px 14px 10px 40px;
          font-size: 0.9rem;
          border-radius: 12px;
          border: var(--border-width, 1px) solid var(--border-subtle);
          background: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .categories-search-bar:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
        }

        .cat-card:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }

        .cat-hero-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .cat-matrix-cell {
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 1rem;
          text-decoration: none;
          cursor: pointer;
        }
        .cat-cell-top-left { border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
        .cat-cell-top-right { border-bottom: 1px solid var(--border-subtle); }
        .cat-cell-bot-left { border-right: 1px solid var(--border-subtle); }

        .cat-crosshair {
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
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
        {/* Animated Categories Hero Card Banner */}
        <div className="categories-hero-card">
          <div className="categories-hero-grid">
            {/* Left Column: Badge, Headline, Subtitle, CTAs, Search */}
            <div>
              <div className="categories-pill-badge">
                <span>+ AI Categories</span>
              </div>

              <h1 className="categories-hero-heading">
                Find the right AI tool
                <br />
                for any use case
              </h1>

              <p className="categories-hero-sub">
                Browse hand-curated AI software organized across {categories.length}+ categories — from coding copilots to generative design and autonomous agents.
              </p>

              {/* Action CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {
                    const gridEl = document.getElementById('categories-grid');
                    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
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
                  Explore categories <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </button>
                <Link
                  href="/submit"
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
                  Submit a tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </Link>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', maxWidth: '480px', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={`Search ${categories.length} categories...`}
                  className="categories-search-bar"
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Animated Crosshair 2x2 Category Grid with Superhuman Live Rotation */}
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={() => setIsMatrixPaused(true)}
              onMouseLeave={() => setIsMatrixPaused(false)}
            >
              <div className="cat-hero-matrix">
                {matrixSlots.map((item, idx) => {
                  const cellClasses = ['cat-cell-top-left', 'cat-cell-top-right', 'cat-cell-bot-left', ''];
                  const cellClass = cellClasses[idx];
                  const toolCount = counts[item.name] || 0;

                  return (
                    <Link
                      key={idx}
                      href={`/category/${slugifyCategory(item.name)}`}
                      className={`cat-matrix-cell ${cellClass}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 6, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.94 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                            flexShrink: 0,
                          }}>
                            {item.icon}
                          </div>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                            {item.name}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </Link>
                  );
                })}

                {/* Center Crosshair */}
                <div className="cat-crosshair">+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Marquee — card style matching tools page */}
        {!search.trim() && (
          <div id="categories-grid" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '8px' }}>
              <div className="categories-pill-badge" style={{ marginBottom: 0 }}>
                <span>+ Browse Categories</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {categories.length} categories available
              </span>
            </div>
            <div className="cat-marquee-container">
              <div className="cat-marquee-track">
                {[...categories, ...categories].map((cat, idx) => (
                  <Link
                    key={`${cat}-${idx}`}
                    href={`/category/${slugifyCategory(cat)}`}
                    className="cat-marquee-card"
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'var(--border-width, 1px) solid var(--border-subtle)',
                      color: 'var(--accent-primary)',
                    }}>
                      <CategoryIcon category={cat} size={18} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {cat.replace('AI ', '')}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}>
                        {counts[cat] || 0} tools
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <style>{`
              .cat-marquee-container {
                overflow: hidden;
                position: relative;
                width: 100%;
                padding: 6px 0;
                mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
                -webkit-mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
              }
              .cat-marquee-track {
                display: flex;
                gap: 14px;
                width: max-content;
                animation: catMarquee 300s linear infinite;
              }
              .cat-marquee-track:hover {
                animation-play-state: paused;
              }
              @keyframes catMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .cat-marquee-card {
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--bg-card);
                border: var(--border-width, 1px) solid var(--border-subtle);
                border-radius: 14px;
                padding: 9px 16px;
                text-decoration: none;
                min-width: 185px;
                max-width: 215px;
                flex-shrink: 0;
                transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
                box-shadow: var(--shadow-card);
              }
              .cat-marquee-card:hover {
                border-color: var(--accent-primary) !important;
                box-shadow: var(--shadow-hover) !important;
                transform: translateY(-2px);
              }
            `}</style>
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: 'var(--border-width, 1px) solid var(--border-subtle)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No categories found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search query.</p>
          </div>
        ) : (
          <>
            <div className="category-grid">
            {paginated.map((cat) => {
              const count = counts[cat] || 0;
              return (
                <Link
                  key={cat}
                  href={`/category/${slugifyCategory(cat)}`}
                  className="cat-card"
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                    background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <CategoryIcon category={cat} size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2, marginBottom: '4px' }}>
                      {cat.replace('AI ', '')}
                    </h3>
                    {CATEGORY_SHORT_DESCRIPTIONS[cat] && (
                      <p style={{
                        fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', margin: 0, marginBottom: '6px'
                      }}>
                        {CATEGORY_SHORT_DESCRIPTIONS[cat]}
                      </p>
                    )}
                    <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        border: 'var(--border-width, 1px) solid var(--border-subtle)',
                        borderRadius: '99px',
                        padding: '2px 8px',
                        background: 'var(--bg-primary)'
                      }}>
                        {count} tools
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {paginated.length < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary"
                style={{ padding: '10px 28px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
