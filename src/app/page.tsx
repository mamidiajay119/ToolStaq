import Link from 'next/link';
import { ArrowRight, Search, Sparkles, TrendingUp, Star } from 'lucide-react';
import { getAllTools, getCategoryCounts, getMeta, getFeaturedTools, slugifyCategory } from '@/lib/tools';
import CategoryIcon from '@/components/ui/CategoryIcon';
import ToolCard from '@/components/tools/ToolCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tools Directory — Discover 2,688+ AI Tools',
  description: 'Find the perfect AI tool for your workflow. Browse 2,688+ AI tools across 27 categories including writing, coding, design, video, automation and more.',
};

const TOP_CATEGORIES = [
  'AI Writing', 'AI Coding', 'AI Design', 'AI Video',
  'AI Automation', 'AI Marketing', 'AI Analytics', 'AI Productivity',
  'AI Research', 'AI Audio', 'AI Sales', 'AI Education',
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
        .cat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          cursor: pointer;
          text-decoration: none;
        }
        .cat-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        .how-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.75rem;
          text-align: center;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        }
        .how-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
      `}</style>

      <div>
        {/* ── Hero ── */}
        <section style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '5rem 1.5rem 4rem',
          overflow: 'hidden',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
            borderRadius: '6px', padding: '6px 16px', marginBottom: '1.5rem',
            fontSize: '0.825rem', color: 'var(--accent-primary)', fontWeight: 600,
          }}>
            <Sparkles size={13} />
            <span>The Most Comprehensive AI Tools Directory</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            maxWidth: '820px',
            marginBottom: '1.25rem',
          }}>
            Discover the Right{' '}
            <span style={{ color: 'var(--accent-primary)' }}>AI Tool</span>
            <br />for Every Workflow
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '580px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Browse <strong style={{ color: 'var(--text-primary)' }}>{meta.total.toLocaleString()}+ AI tools</strong> across{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{meta.categories} categories</strong>.
            Filter by price, complexity, deployment, and more.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
            <Link href="/tools" className="btn-primary" style={{ fontSize: '1rem', padding: '13px 28px' }}>
              <Search size={17} /> Browse All Tools
            </Link>
            <Link href="/compare" className="btn-secondary" style={{ fontSize: '1rem', padding: '13px 28px' }}>
              Compare Tools <ArrowRight size={17} />
            </Link>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center',
            padding: '1.25rem 2rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
          }}>
            {dynamicStats.map((stat) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{stat.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: stat.color, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="container-xl">
          {/* ── Category Grid ── */}
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px' }}>Browse by Category</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{meta.categories} categories covering every AI use case</p>
              </div>
              <Link href="/tools" className="btn-ghost" style={{ color: 'var(--accent-violet)' }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}>
              {TOP_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const slug = slugifyCategory(cat);
                return (
                  <Link key={cat} href={`/category/${slug}`} className="cat-card">
                    <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', height: '1.6rem' }}>
                      <CategoryIcon category={cat} size={24} />
                    </span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {cat}
                      </div>
                      <div style={{ marginTop: 'auto' }}>
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
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--accent-violet)' }} />
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Trending Tools</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Top AI tools picked from across categories</p>
              </div>
              <Link href="/tools" className="btn-ghost" style={{ color: 'var(--accent-violet)' }}>
                See all {meta.total.toLocaleString()} tools <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}>
              {featuredTools.map((tool, i) => (
                <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
              ))}
            </div>
          </section>

          {/* ── CTA Banner ── */}
          <section style={{ marginBottom: '5rem' }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '3rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Star size={28} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Know a Tool We&apos;re Missing?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Help the community grow. Submit any AI tool and we&apos;ll add it to the directory within 24 hours.
              </p>
              <Link href="/submit" className="btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                Submit a Tool <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section style={{ marginBottom: '5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find Your Perfect AI Tool in 3 Steps</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>No sign-up required. Free forever.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { step: '01', icon: '🔍', title: 'Search or Browse', desc: 'Search by use case or browse across 27 AI categories.' },
                { step: '02', icon: '⚙️', title: 'Filter & Compare', desc: 'Narrow down by pricing, complexity, API availability, and more.' },
                { step: '03', icon: '🚀', title: 'Visit & Try', desc: 'Click through to the tool and start a free trial instantly.' },
              ].map((step) => (
                <div key={step.step} className="how-card">
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', margin: '0 auto 1rem',
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                    STEP {step.step}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
