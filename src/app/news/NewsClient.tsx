'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, Calendar, Clock, Eye, TrendingUp, Flame, Sparkles, Bot, Code2, Globe, ShieldCheck, Newspaper, ChevronRight, Plus } from 'lucide-react';
import type { NewsArticle } from './page';
import NewsletterForm from '@/components/news/NewsletterForm';

interface NewsClientProps {
  newsArticles: NewsArticle[];
  topArticles: NewsArticle[];
}

const CATEGORIES = ['All', 'Frontier Models', 'AI Agents', 'Open Source', 'Regulation', 'AI News'];

const CATEGORY_COLORS: Record<string, string> = {
  'Frontier Models': '#8b5cf6',
  'AI Agents': '#0891b2',
  'Open Source': '#059669',
  'Regulation': '#e11d48',
  'AI News': '#ea580c',
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'Frontier Models': Sparkles,
  'AI Agents': Bot,
  'Open Source': Code2,
  'Regulation': ShieldCheck,
  'AI News': Newspaper,
};

function trackView(slug: string) {
  fetch('/api/news/view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}

function ArticleImage({ image_url, category, title, size = 'sm' }: {
  image_url?: string;
  category: string;
  title: string;
  size?: 'sm' | 'lg';
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const color = CATEGORY_COLORS[category] || '#ea580c';
  const IconComponent = CATEGORY_ICONS[category] || Newspaper;
  
  const h = size === 'lg' ? '160px' : '54px';
  const w = size === 'lg' ? '100%' : '54px';
  const radius = size === 'lg' ? '12px 12px 0 0' : '10px';
  const iconSize = size === 'lg' ? 32 : 20;

  // Route all external images through our server-side proxy to bypass
  // hotlink protection and CORS restrictions on Reddit, Medium, etc.
  const proxySrc = image_url
    ? `/api/image-proxy?url=${encodeURIComponent(image_url)}`
    : null;

  return (
    <div style={{ position: 'relative', width: w, height: h, flexShrink: 0, borderRadius: radius, overflow: 'hidden' }}>
      {/* Solid category tile filling the entire thumbnail slot with centered white icon */}
      <div style={{
        position: 'absolute', inset: 0,
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px ${color}30`,
      }}>
        <IconComponent size={iconSize} color="#FFFFFF" />
      </div>

      {/* Image overlay — fades in only on successful load */}
      {proxySrc && !imgError && (
        <img
          src={proxySrc}
          alt={title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 250ms ease',
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}

export default function NewsClient({ newsArticles, topArticles }: NewsClientProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);

  const isFiltering = search.trim() !== '' || activeCategory !== 'All';

  const filtered = useMemo(() => {
    let list = newsArticles;
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      list = list.filter(a => a.category === activeCategory);
    }
    return list;
  }, [search, activeCategory, newsArticles]);

  const filteredTop = useMemo(() => {
    if (!isFiltering) return topArticles;
    return filtered.slice(0, 3);
  }, [isFiltering, topArticles, filtered]);

  const gridArticles = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  return (
    <>
      <style>{`
        /* ── News Hero Card Banner (Matching Tools Banner) ── */
        .news-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .news-hero-card {
          background: linear-gradient(135deg, #0d0a17 0%, #110d1e 50%, #0d0a17 100%);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .news-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .news-hero-grid { grid-template-columns: 1.15fr 0.85fr; }
        }

        .news-pill-badge {
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
        [data-theme='dark'] .news-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .news-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }
        @media (min-width: 640px) {
          .news-hero-heading { font-size: 2.85rem; }
        }

        .news-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 500px;
        }

        .news-search-bar {
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
        .news-search-bar:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
        }

        .news-hero-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .news-matrix-cell {
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
        .news-cell-top-left { border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
        .news-cell-top-right { border-bottom: 1px solid var(--border-subtle); }
        .news-cell-bot-left { border-right: 1px solid var(--border-subtle); }

        .news-crosshair {
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

        /* ── Centered Category Pills Bar ── */
        .news-category-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          flex-wrap: nowrap;
          white-space: nowrap;
          margin-bottom: 2.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .news-category-bar::-webkit-scrollbar {
          display: none;
        }

        /* ── Monochrome Category Badges ── */
        .mono-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: var(--text-primary);
          flex-shrink: 0;
        }
        [data-theme='dark'] .mono-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        .news-pill {
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
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          color: #3f3f46;
        }

        .news-pill:hover {
          border-color: rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          color: #09090b;
        }

        .news-pill.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
        }

        [data-theme='dark'] .news-pill {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          color: #a1a1aa;
        }
        [data-theme='dark'] .news-pill:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.2);
          color: #f4f4f5;
        }
        [data-theme='dark'] .news-pill.active {
          background: #ffffff;
          border-color: #ffffff;
          color: #09090b;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
        }

        /* ── Top This Week & Grid Cards ── */
        .top-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          overflow: hidden;
          text-decoration: none;
          flex: 1;
          min-width: 0;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          box-shadow: var(--shadow-card);
        }
        .top-card:hover {
          transform: translateY(-3px);
          border-color: rgba(139,92,246,0.4) !important;
          box-shadow: var(--shadow-hover);
        }
        .top-card-body { padding: 1rem 1.1rem 1.1rem; display: flex; flex-direction: column; gap: 8px; flex: 1; }

        .news-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 2rem;
        }
        @media (min-width: 640px) {
          .news-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .news-card {
          display: flex;
          gap: 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 1rem;
          text-decoration: none;
          align-items: flex-start;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          box-shadow: var(--shadow-card);
        }
        .news-card:hover {
          transform: translateY(-2px);
          border-color: rgba(139,92,246,0.35) !important;
          box-shadow: var(--shadow-hover);
        }

        .top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) { .top-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .top-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
        {/* Animated News Hero Card Banner (Matching Tools Hero Banner) */}
        <div className="news-hero-card">
          <div className="news-hero-grid">
            {/* Left Column: Badge, Headline, Subtitle, CTAs, Search */}
            <div>
              <div className="news-pill-badge">
                <span>+ AI intel</span>
              </div>

              <h1 className="news-hero-heading">
                The signal is real.<br />AI news, simplified.
              </h1>
              
              <p className="news-hero-sub">
                Curated breakthroughs, model releases, and engineering trends across frontier AI. No noise, just verified intel.
              </p>

              {/* Action CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {
                    const gridEl = document.getElementById('news-articles-grid');
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
                  Read latest news <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </button>
                <a
                  href="#newsletter-signup"
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
                  Subscribe to briefings <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </a>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', maxWidth: '480px', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(8); }}
                  placeholder="Search AI news, models, companies..."
                  className="news-search-bar"
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Live Breaking News Headline Cards Widget */}
            <div style={{ position: 'relative', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hidden-mobile">
              {/* Card 1: Top Floating News Story */}
              <motion.a
                href={newsArticles[0]?.url || `/news/${newsArticles[0]?.slug}`}
                target={newsArticles[0]?.url ? '_blank' : undefined}
                rel={newsArticles[0]?.url ? 'noopener noreferrer' : undefined}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.04, y: -6 }}
                style={{
                  position: 'absolute', top: '10px', right: '25px', width: '240px', height: '140px',
                  borderRadius: '20px', background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  padding: '1.15rem', color: '#ffffff', transform: 'rotate(4deg)',
                  boxShadow: '0 12px 32px rgba(124, 58, 237, 0.35)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  textDecoration: 'none', zIndex: 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
                    {newsArticles[0]?.category || 'Frontier Models'}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>
                    {newsArticles[0]?.readTime || '2 min read'}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {newsArticles[0]?.title || 'Claude & GPT-5 Benchmarks Released'}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{newsArticles[0]?.source || 'TechCrunch'}</span>
                </div>
              </motion.a>

              {/* Card 2: Bottom Floating News Story */}
              <motion.a
                href={newsArticles[1]?.url || `/news/${newsArticles[1]?.slug}`}
                target={newsArticles[1]?.url ? '_blank' : undefined}
                rel={newsArticles[1]?.url ? 'noopener noreferrer' : undefined}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                whileHover={{ scale: 1.04, y: -6 }}
                style={{
                  position: 'absolute', bottom: '10px', left: '10px', width: '250px', height: '145px',
                  borderRadius: '20px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  padding: '1.2rem', color: '#ffffff', transform: 'rotate(-4deg)',
                  boxShadow: '0 14px 36px rgba(8, 145, 178, 0.4)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2,
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
                    {newsArticles[1]?.category || 'AI Agents'}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>
                    {newsArticles[1]?.readTime || '3 min read'}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {newsArticles[1]?.title || 'Autonomous Coding Agents Hit Production'}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{newsArticles[1]?.source || 'Engadget'}</span>
                </div>
              </motion.a>

              {/* Central Floating Live Intel Badge */}
              <div style={{
                position: 'absolute', zIndex: 3,
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.94)',
                border: '1.5px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#6d28d9', textAlign: 'center', padding: '6px',
                transform: 'rotate(-10deg)', backdropFilter: 'blur(10px)',
              }}>
                <Flame size={18} color="#7c3aed" fill="#7c3aed" style={{ marginBottom: '2px' }} />
                <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  • LIVE NEWS • INTEL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top This Week (cascade animation) ── */}
        {filteredTop.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}
            >
              <div className="news-pill-badge" style={{ marginBottom: 0 }}>
                <span>+ Top stories</span>
              </div>
            </motion.div>

            {/* Stagger container: each card cascades in fast */}
            <motion.div
              className="top-grid"
              initial="show"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {filteredTop.map((article) => (
                <motion.a
                  key={article.id}
                  href={article.url || `/news/${article.slug}`}
                  target={article.url ? '_blank' : undefined}
                  rel={article.url ? 'noopener noreferrer' : undefined}
                  className="top-card"
                  onClick={() => trackView(article.slug)}
                  variants={{
                    hidden: { opacity: 1, y: 0, scale: 1 },
                    show: {
                      opacity: 1, y: 0, scale: 1,
                      transition: { duration: 0.2 },
                    },
                  }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                >
                  <ArticleImage image_url={article.image_url} category={article.category} title={article.title} size="lg" />
                  <div className="top-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="mono-badge">
                        {article.category}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{article.source}</span>
                    </div>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <Calendar size={11} /> {article.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <Clock size={11} /> {article.readTime}
                      </span>
                      {article.view_count > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          <Eye size={11} /> {article.view_count.toLocaleString()} reads
                        </span>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </section>
        )}

        {/* ── Centered Category Pills Bar ── */}
        <div id="news-articles-grid" className="news-category-bar hide-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`news-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Article Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No articles found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search or selecting a different category.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {isFiltering ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'All Articles'}
              </span>
              {isFiltering && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); setVisibleCount(8); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  Clear filters <X size={12} />
                </button>
              )}
            </div>
            <div className="news-grid">
              {gridArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.url || `/news/${article.slug}`}
                  target={article.url ? '_blank' : undefined}
                  rel={article.url ? 'noopener noreferrer' : undefined}
                  className="news-card"
                  onClick={() => trackView(article.slug)}
                >
                  <ArticleImage image_url={article.image_url} category={article.category} title={article.title} size="sm" />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="mono-badge">
                        {article.category}
                      </span>
                      <span style={{ fontSize: '0.67rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {article.source}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {article.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.67rem', color: 'var(--text-muted)' }}>
                        <Calendar size={10} /> {article.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.67rem', color: 'var(--text-muted)' }}>
                        <Clock size={10} /> {article.readTime}
                      </span>
                      {article.view_count > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.67rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          <Eye size={10} /> {article.view_count.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {filtered.length > visibleCount && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="btn-secondary"
                  style={{
                    padding: '10px 26px',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Load more articles <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Newsletter ── */}
        <section id="newsletter-signup" style={{ marginTop: '5.5rem' }}>
          <div className="newsletter-card" style={{ textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.75rem', letterSpacing: '-0.01em', textAlign: 'center' }}>Subscribe to AI Updates</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', maxWidth: '460px', margin: '0 auto 1.75rem', lineHeight: 1.5, textAlign: 'center' }}>
              Get a weekly summary of the most important AI tool launches and news stories sent straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </section>

      </div>
    </>
  );
}
