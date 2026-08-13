'use client';

import { useState, useMemo } from 'react';
import { Search, X, Calendar, Clock } from 'lucide-react';
import type { NewsArticle } from './page';
import NewsletterForm from '@/components/news/NewsletterForm';

interface NewsClientProps {
  newsArticles: NewsArticle[];
}

export default function NewsClient({ newsArticles }: NewsClientProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return newsArticles;
    return newsArticles.filter(art => 
      art.title.toLowerCase().includes(q) || 
      art.excerpt.toLowerCase().includes(q) || 
      art.category.toLowerCase().includes(q) || 
      art.source.toLowerCase().includes(q)
    );
  }, [search, newsArticles]);

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
        .news-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          cursor: pointer;
          text-decoration: none;
        }
        .news-card:hover {
          border-color: rgba(249, 115, 22, 0.35) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        .news-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 5rem;
        }
        @media (min-width: 768px) {
          .news-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
          }
          .news-card-content {
            flex: 1;
            min-width: 0;
          }
          .news-card-meta {
            flex-direction: column !important;
            align-items: flex-end;
            gap: 6px !important;
          }
        }
      `}</style>

      {/* Expanded Inner Hero Banner */}
      <div className="inner-hero" style={{ padding: '4.5rem 1.5rem 5.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>AI News</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Latest breakthroughs, model releases, and engineering trends.</p>
        
        {/* Search box inside Hero */}
        <div style={{ position: 'relative', maxWidth: '580px', width: '100%', margin: '1.75rem auto 1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI news articles..."
            className="hero-search-input"
            style={{
              width: '100%',
              paddingLeft: '44px',
              paddingRight: search ? '40px' : '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: '0.95rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
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

        {/* Trending News Tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Popular:</span>
          {['GPT-5', 'Claude', 'Open Source', 'Regulation'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearch(tag)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
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
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '1.75rem',
          maxWidth: '580px',
          width: '100%',
          margin: '0.5rem auto 0',
        }} className="hero-stats-row">
          {[
            { number: '124+', label: 'Sources Tracked' },
            { number: 'Real-time', label: 'Sync' },
            { number: 'Weekly', label: 'Briefings' },
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
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No articles found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filtered.map((article) => (
              <a 
                key={article.id} 
                href={article.url || `/news/${article.slug}`} 
                target={article.url ? "_blank" : undefined}
                rel={article.url ? "noopener noreferrer" : undefined}
                className="news-card"
              >
                <div className="news-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-slate" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px' }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {article.source}
                    </span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                    margin: 0,
                  }}>
                    {article.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    margin: 0,
                    maxWidth: '720px',
                  }}>
                    {article.excerpt}
                  </p>
                </div>

                <div className="news-card-meta" style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '0.725rem',
                  color: 'var(--text-muted)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    <Calendar size={12} /> {article.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    <Clock size={12} /> {article.readTime}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <section style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              right: '-50px',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />
            
            <h2 style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
              Subscribe to AI Updates
            </h2>
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
