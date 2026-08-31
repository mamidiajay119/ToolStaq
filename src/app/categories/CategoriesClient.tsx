'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
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
        .cat-card:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
      `}</style>

      {/* Expanded Inner Hero Banner */}
      <div className="inner-hero" style={{ padding: '4.5rem 1.5rem 5.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>AI Categories</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Find the perfect AI tool for your specific workflow.</p>
        
        {/* Search box inside Hero */}
        <div style={{ position: 'relative', maxWidth: '580px', width: '100%', margin: '1.75rem auto 1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={`Search ${categories.length} categories...`}
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
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Trending Categories */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Popular:</span>
          {['Coding', 'Writing', 'Design', 'Audio'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearch(tag)}
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
            { number: `${categories.length}`, label: 'AI Categories' },
            { number: '2,729+', label: 'Curated Tools' },
            { number: 'Free & Paid', label: 'Pricing Models' },
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

        {/* Categories Marquee — card style matching tools page */}
        {!search.trim() && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                Browse Categories
              </span>
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
                style={{ padding: '10px 28px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}
              >
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
