import Link from 'next/link';
import { ArrowRight, Search, Sparkles, TrendingUp, Star } from 'lucide-react';
import { getAllTools, getCategoryCounts, getMeta, getFeaturedTools, slugifyCategory } from '@/lib/tools';
import CategoryIcon from '@/components/ui/CategoryIcon';
import ToolCard from '@/components/tools/ToolCard';
import type { Metadata } from 'next';
import { CATEGORY_SHORT_DESCRIPTIONS } from '@/lib/category-content';

export const metadata: Metadata = {
  title: 'ToolStaq — Find the Best AI Tools',
  description: 'Find the perfect AI tool for your workflow. Browse top AI tools across categories including writing, coding, design, video, automation and more.',
};

const TOP_CATEGORIES = [
  'AI Writing', 'AI Coding', 'AI Design',
  'AI Video', 'AI Automation', 'AI Marketing',
  'AI Analytics', 'AI Productivity', 'AI Research',
];

export default function HomePage() {
  const meta = getMeta();
  const categoryCounts = getCategoryCounts();
  const featuredTools = getFeaturedTools(9);
  const allTools = getAllTools();
  const totalFree = allTools.filter(t => t.free_trial || t.pricing_model === 'freemium').length;
  const totalWithApi = allTools.filter(t => t.has_api).length;

  const dynamicStats = [
    { label: 'AI Tools', value: `${meta.total.toLocaleString()}+`, icon: '⚡', color: '#a78bfa' },
    { label: 'Categories', value: meta.categories.toString(), icon: '📂', color: '#67e8f9' },
    { label: 'Free / Freemium', value: `${totalFree.toLocaleString()}+`, icon: '🆓', color: '#6ee7b7' },
    { label: 'With APIs', value: `${totalWithApi.toLocaleString()}+`, icon: '🔌', color: '#fcd34d' },
  ];

  return (
    <>
      <style>{`
        .how-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.75rem;
          text-align: left;
          box-shadow: var(--shadow-card);
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        }
        .how-card:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        .trending-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .trending-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .trending-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 99px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.775rem;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease;
          cursor: pointer;
        }
        .hero-pill:hover {
          border-color: var(--accent-primary) !important;
          color: var(--text-primary);
          background: var(--bg-card);
        }
      `}</style>

      <div>
        {/* ── Hero ── */}
        <section className="hero-section">
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Headline */}
            <h1 className="hero-heading">
              Discover the right{' '}
              <span className="gradient-text-orange">AI Tools</span>
              <br />for every workflow
            </h1>

            <p className="hero-subheading">
              Explore a curated index of <strong style={{ color: 'var(--text-primary)' }}>{meta.total.toLocaleString()}+ AI tools</strong> across{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{meta.categories} categories</strong>. Filter by pricing, complexity, and deployment to optimize your workflow.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <Link href="/tools" className="btn-primary" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
                <Search size={15} /> browse
              </Link>
              <Link href="/compare" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
                compare <ArrowRight size={15} />
              </Link>
            </div>

            {/* Quick Links / Popular Pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              maxWidth: '640px',
              margin: '0 auto',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px', letterSpacing: '0.05em' }}>popular:</span>
              {[
                { label: 'writing', slug: 'ai-writing' },
                { label: 'coding', slug: 'ai-coding' },
                { label: 'design', slug: 'ai-design' },
                { label: 'video', slug: 'ai-video' },
                { label: 'productivity', slug: 'ai-productivity' },
                { label: 'marketing', slug: 'ai-marketing' },
              ].map((pill) => (
                <Link
                  key={pill.slug}
                  href={`/category/${pill.slug}`}
                  className="hero-pill"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="container-xl">
          {/* ── Category Grid ── */}
          <section style={{ marginBottom: '7.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>Browse by Category</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{meta.categories} categories covering every AI use case</p>
              </div>
              <Link href="/tools" className="btn-ghost" style={{ color: 'var(--accent-violet)', fontSize: '0.825rem' }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="category-grid">
              {TOP_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const slug = slugifyCategory(cat);
                return (
                  <Link
                    key={cat}
                    href={`/category/${slug}`}
                    className="cat-card"
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)',
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
                          border: '1px solid var(--border-subtle)',
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
          </section>

          {/* ── Featured Tools ── */}
          <section style={{ marginBottom: '7.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>Trending Tools</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Top AI tools picked from across categories</p>
              </div>
              <Link href="/tools" className="btn-ghost" style={{ color: 'var(--accent-violet)', fontSize: '0.825rem' }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="trending-grid">
              {featuredTools.map((tool, i) => (
                <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
              ))}
            </div>
          </section>

          {/* ── CTA Banner ── */}
          <section style={{ marginBottom: '7.5rem' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-card)',
              padding: '3rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Star size={28} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                Know a Tool We&apos;re Missing?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Help the community grow. Submit any AI tool and we&apos;ll add it to the directory within 24 hours.
              </p>
              <Link href="/submit" className="btn-primary" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
                Submit a Tool <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section style={{ marginBottom: '7.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Find Your Perfect AI Tool in 3 Steps</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>No sign-up required. Free forever.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { step: '01', title: 'Search or Browse', desc: 'Search by use case or browse across categories.' },
                { step: '02', title: 'Filter & Compare', desc: 'Narrow down by pricing, complexity, API availability, and more.' },
                { step: '03', title: 'Visit & Try', desc: 'Click through to the tool and start a free trial instantly.' },
              ].map((step) => (
                <div key={step.step} className="how-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    opacity: 0.6,
                    lineHeight: 1,
                    marginBottom: '1rem',
                    fontFamily: 'monospace',
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
