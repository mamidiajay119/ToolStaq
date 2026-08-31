import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';
import { getAllTools, getFeaturedTools, slugifyCategory, getAllCategories } from '@/lib/tools';
import ToolCard from '@/components/tools/ToolCard';
import HomeMarquee from '@/components/home/HomeMarquee';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'toolstaq — Find the Best AI Tools',
  description: 'Find the perfect AI tool for your workflow. Browse top AI tools across categories including writing, coding, design, video, automation and more.',
};

const TOP_CATEGORIES = [
  'AI Writing', 'AI Coding', 'AI Design',
  'AI Video', 'AI Automation', 'AI Marketing',
  'AI Analytics', 'AI Productivity', 'AI Research',
];

export default async function HomePage() {
  // Run all data fetches in parallel — not sequentially
  const [allTools, featuredTools] = await Promise.all([
    getAllTools(),
    getFeaturedTools(9),
  ]);

  // Derive category counts from the already-fetched allTools (no extra DB call)
  const categoryCounts: Record<string, number> = {};
  allTools.forEach((t) => {
    t.category.forEach((c) => {
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });
  });

  const totalTools = allTools.length;
  const totalCategories = getAllCategories().length;
  const totalFree = allTools.filter(t => t.free_trial || t.pricing_model === 'freemium').length;
  const totalWithApi = allTools.filter(t => t.has_api).length;

  // Pre-compute for CategoryGrid — plain data, no functions passed to client
  const categoryItems = TOP_CATEGORIES.map((cat) => ({
    cat,
    slug: slugifyCategory(cat),
    count: categoryCounts[cat] || 0,
  }));

  const dynamicStats = [
    { label: 'AI Tools', value: `${totalTools.toLocaleString()}+`, icon: '⚡', color: '#a78bfa' },
    { label: 'Categories', value: totalCategories.toString(), icon: '📂', color: '#67e8f9' },
    { label: 'Free / Freemium', value: `${totalFree.toLocaleString()}+`, icon: '🆓', color: '#6ee7b7' },
    { label: 'With APIs', value: `${totalWithApi.toLocaleString()}+`, icon: '🔌', color: '#fcd34d' },
  ];

  return (
    <>
      <style>{`
        .how-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
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
          border: var(--border-width, 1px) solid var(--border-subtle);
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
        {/* ── Hero (animated client component) ── */}
        <HeroSection totalTools={totalTools} totalCategories={totalCategories} />

        {/* ── Top Picks Marquee Band — full width between hero and content ── */}
        <HomeMarquee tools={allTools
          .filter(t => t.is_recommended)
          .map(t => ({
            slug: t.slug,
            tool_name: t.tool_name,
            url: t.url,
            favicon_url: t.favicon_url ?? null,
            primary_category: t.primary_category,
          }))
        } />

        <div className="container-xl">
          {/* ── Category Grid (animated client component) ── */}
          <CategoryGrid
            categoryItems={categoryItems}
            totalCategories={totalCategories}
          />

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
                <ToolCard key={tool.slug} tool={tool} hideRecommendedBadge={true} />
              ))}
            </div>
          </section>

          {/* ── CTA Banner ── */}
          <section style={{ marginBottom: '7.5rem' }}>
            <div className="submit-cta-card" style={{
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1rem' }}>
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
