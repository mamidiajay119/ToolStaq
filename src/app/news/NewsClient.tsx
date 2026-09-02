'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, Calendar, Clock, Eye, TrendingUp, Flame, Sparkles, Bot, Code2, Globe, ShieldCheck, Newspaper } from 'lucide-react';
import type { NewsArticle } from './page';
import NewsletterForm from '@/components/news/NewsletterForm';

interface NewsClientProps {
  newsArticles: NewsArticle[];
  topArticles: NewsArticle[];
}

const CATEGORIES = ['All', 'Frontier Models', 'AI Agents', 'Open Source', 'Web Dev', 'Regulation', 'AI News'];

const CATEGORY_COLORS: Record<string, string> = {
  'Frontier Models': '#a78bfa',
  'AI Agents': '#67e8f9',
  'Open Source': '#6ee7b7',
  'Web Dev': '#fcd34d',
  'Regulation': '#fca5a5',
  'AI News': '#f97316',
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'Frontier Models': Sparkles,
  'AI Agents': Bot,
  'Open Source': Code2,
  'Web Dev': Globe,
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
  const color = CATEGORY_COLORS[category] || '#f97316';
  const IconComponent = CATEGORY_ICONS[category] || Newspaper;
  const h = size === 'lg' ? '180px' : '64px';
  const w = size === 'lg' ? '100%' : '64px';
  const radius = size === 'lg' ? '12px 12px 0 0' : '10px';
  const badgeSize = size === 'lg' ? '48px' : '32px';
  const iconSize = size === 'lg' ? 22 : 16;
  const badgeRadius = size === 'lg' ? '14px' : '9px';

  // Route all external images through our server-side proxy to bypass
  // hotlink protection and CORS restrictions on Reddit, Medium, etc.
  const proxySrc = image_url
    ? `/api/image-proxy?url=${encodeURIComponent(image_url)}`
    : null;

  return (
    <div style={{ position: 'relative', width: w, height: h, flexShrink: 0, borderRadius: radius, overflow: 'hidden' }}>
      {/* Modern glassmorphic icon badge fallback */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 35%, ${color}25 0%, ${color}08 70%), linear-gradient(135deg, #09090b 0%, #121217 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: size === 'lg' ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{
          width: badgeSize, height: badgeSize,
          borderRadius: badgeRadius,
          background: `${color}18`,
          border: `1px solid ${color}38`,
          boxShadow: `0 4px 16px ${color}20, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <IconComponent size={iconSize} color={color} />
        </div>
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
        /* ── Hero search ── */
        .news-search-input { color: var(--text-primary) !important; }
        .news-search-input::placeholder { color: var(--text-muted) !important; }
        .news-search-input:focus { border-color: rgba(255,255,255,0.25) !important; }

        /* ── Category tabs ── */
        .news-tab {
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 0.78rem;
          font-weight: 500;
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 140ms ease, color 140ms ease, background 140ms ease;
        }
        .news-tab:hover { color: var(--text-primary); border-color: var(--accent-primary); }
        .news-tab.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #fff;
        }

        /* ── Top This Week cards ── */
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
          border-color: rgba(249,115,22,0.4) !important;
          box-shadow: var(--shadow-hover);
        }
        .top-card-body { padding: 1rem 1.1rem 1.1rem; display: flex; flex-direction: column; gap: 8px; flex: 1; }

        /* ── Article grid ── */
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
          border-color: rgba(249,115,22,0.35) !important;
          box-shadow: var(--shadow-hover);
        }

        /* ── Top section 3-col grid ── */
        .top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) { .top-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .top-grid { grid-template-columns: repeat(3, 1fr); } }

        .newsletter-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .newsletter-card { background: #000 !important; }
      `}</style>

      {/* ── Hero ── */}
      <div className="inner-hero" style={{ padding: '4.5rem 1.5rem 5.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>AI News</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          Latest breakthroughs, model releases, and engineering trends.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '560px', width: '100%', margin: '1.75rem auto 1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(8); }}
            placeholder="Search AI news..."
            className="news-search-input"
            style={{
              width: '100%',
              paddingLeft: '44px',
              paddingRight: search ? '40px' : '16px',
              paddingTop: '11px',
              paddingBottom: '11px',
              fontSize: '0.925rem',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.08)',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'border-color 150ms ease',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '3rem', flexWrap: 'wrap',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '1.5rem', maxWidth: '560px', width: '100%', margin: '0.5rem auto 0',
        }}>
          {[
            { number: `${newsArticles.length}+`, label: 'Articles' },
            { number: 'Real-time', label: 'Sync' },
            { number: 'Weekly', label: 'Briefings' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{stat.number}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-xl" style={{ paddingBottom: '4rem' }}>

        {/* ── Top This Week (cascade animation) ── */}
        {filteredTop.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}
            >
              <Flame size={15} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                {isFiltering ? 'Top Results' : 'Top This Week'}
              </span>
            </motion.div>

            {/* Stagger container: each card cascades in 100ms apart */}
            <motion.div
              className="top-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
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
                    hidden: { opacity: 0, y: 28, scale: 0.97 },
                    show: {
                      opacity: 1, y: 0, scale: 1,
                      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                >
                  <ArticleImage image_url={article.image_url} category={article.category} title={article.title} size="lg" />
                  <div className="top-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                        background: `${CATEGORY_COLORS[article.category] || '#f97316'}22`,
                        color: CATEGORY_COLORS[article.category] || '#f97316',
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                      }}>
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

        {/* ── Category Tabs ── */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }} className="hide-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`news-tab${activeCategory === cat ? ' active' : ''}`}
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
                      <span style={{
                        fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: '5px',
                        background: `${CATEGORY_COLORS[article.category] || '#f97316'}22`,
                        color: CATEGORY_COLORS[article.category] || '#f97316',
                        letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0,
                      }}>
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
                  style={{ padding: '10px 28px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500 }}
                >
                  Load more articles
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Newsletter ── */}
        <section style={{ marginTop: '2rem' }}>
          <div className="newsletter-card">
            <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Subscribe to AI Updates</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', maxWidth: '460px', margin: '0 auto 1.75rem', lineHeight: 1.5 }}>
              Get a weekly summary of the most important AI tool launches and news stories sent straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </section>

      </div>
    </>
  );
}
