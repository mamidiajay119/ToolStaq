import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles, TrendingUp, Star, ShieldCheck, Zap } from 'lucide-react';
import { getAllTools, getFeaturedTools, slugifyCategory, getAllCategories } from '@/lib/tools';
import ToolCard from '@/components/tools/ToolCard';
import HomeMarquee from '@/components/home/HomeMarquee';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'toolstaq — The Intelligent Index for AI Tools',
  description: 'Discover the right AI tools to power your workflow. Browse top AI tools across categories including coding, LLMs, design, video, automation and more.',
};

const TOP_CATEGORIES = [
  'AI Writing', 'AI Coding', 'AI Design',
  'AI Video', 'AI Automation', 'AI Marketing',
  'AI Analytics', 'AI Productivity', 'AI Research',
];

export default async function HomePage() {
  // Run data fetches in parallel
  const [allTools, featuredTools] = await Promise.all([
    getAllTools(),
    getFeaturedTools(9),
  ]);

  // Derive category counts
  const categoryCounts: Record<string, number> = {};
  allTools.forEach((t) => {
    t.category.forEach((c) => {
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });
  });

  const totalTools = allTools.length;
  const totalCategories = getAllCategories().length;

  const categoryItems = TOP_CATEGORIES.map((cat) => ({
    cat,
    slug: slugifyCategory(cat),
    count: categoryCounts[cat] || 0,
  }));

  return (
    <>
      <style>{`
        .how-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 2rem;
          text-align: left;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }
        .how-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        [data-theme='dark'] .how-card:hover {
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        }

        .trending-grid {
          display: grid;
          gap: 16px;
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

        .cal-cta-banner {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 3.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        }
        [data-theme='dark'] .cal-cta-banner {
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      <div>
        {/* ── Full Hero Section (Cal.com inspired) ── */}
        <HeroSection totalTools={totalTools} totalCategories={totalCategories} />

        {/* ── Top Picks Marquee Band ── */}
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
          {/* ── Category Grid ── */}
          <CategoryGrid
            categoryItems={categoryItems}
            totalCategories={totalCategories}
          />

          {/* ── Trending Tools Section ── */}
          <section style={{ marginBottom: '6.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="cal-hero-badge" style={{ marginBottom: '0.65rem' }}>
                  <span>+ Trending index</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
                  Featured AI Breakthroughs
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.90rem', margin: '4px 0 0 0' }}>
                  Top-rated AI tools curated directly from developer community signals.
                </p>
              </div>
              <Link href="/tools" className="btn-secondary" style={{ fontSize: '0.84rem', padding: '8px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View directory <ChevronRight size={14} />
              </Link>
            </div>

            <div className="trending-grid">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} hideRecommendedBadge={true} />
              ))}
            </div>
          </section>

          {/* ── How It Works (Cal.com 3-step workflow) ── */}
          <section style={{ marginBottom: '6.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="cal-hero-badge" style={{ marginBottom: '0.65rem' }}>
                <span>+ Simple workflow</span>
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 750, letterSpacing: '-0.035em', margin: 0 }}>
                Find &amp; integrate the right AI in 3 steps
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '6px' }}>
                No mandatory accounts. Instant directory exploration with zero friction.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {[
                { step: '01', title: 'Search or Filter', desc: 'Search by model capability or narrow down by pricing, complexity, and deployment options.' },
                { step: '02', title: 'Compare Specifications', desc: 'Evaluate side-by-side pricing tiers, API key access, and open source repository links.' },
                { step: '03', title: 'Ship & Integrate', desc: 'Click directly through to official product access points and accelerate your build.' },
              ].map((step) => (
                <div key={step.step} className="how-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.04em',
                    marginBottom: '1rem',
                    fontFamily: "'Geist', sans-serif",
                    opacity: 0.85,
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Submit Tool CTA Banner ── */}
          <section style={{ marginBottom: '6.5rem' }}>
            <div className="cal-cta-banner">
              <div className="cal-hero-badge" style={{ marginBottom: '0.85rem' }}>
                <span>+ List your AI product</span>
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 750, letterSpacing: '-0.035em', marginBottom: '0.75rem' }}>
                Building an AI tool? List it on ToolStaq
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                Reach thousands of developers, tech leads, and founders searching for new AI software daily. Fast 4–48h editorial review SLA.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/submit" className="btn-primary" style={{ fontSize: '0.90rem', padding: '10px 22px', borderRadius: '12px' }}>
                  Submit tool <ChevronRight size={16} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </Link>
                <Link href="/tools" className="btn-secondary" style={{ fontSize: '0.90rem', padding: '10px 22px', borderRadius: '12px' }}>
                  Browse directory
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
