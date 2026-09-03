import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles, TrendingUp, Star, ShieldCheck, Zap } from 'lucide-react';
import { getAllTools, getFeaturedTools, slugifyCategory, getAllCategories } from '@/lib/tools';
import ToolCard from '@/components/tools/ToolCard';
import HomeMarquee from '@/components/home/HomeMarquee';
import RotatingBrandGrid from '@/components/home/RotatingBrandGrid';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Intelligent Index for Frontier AI Tools',
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

        <div className="container-xl">
          {/* ── Category Grid ── */}
          <CategoryGrid
            categoryItems={categoryItems}
            totalCategories={totalCategories}
          />

          {/* ── Trending Tools Section ── */}
          <section style={{ marginBottom: '6.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem', gap: '0.5rem' }}>
              <div className="cal-hero-badge" style={{ marginBottom: '0.25rem' }}>
                <span>+ Trending index</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.035em', margin: 0, color: 'var(--text-primary)' }}>
                Featured AI Breakthroughs
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', margin: '0 0 0.5rem 0', maxWidth: '560px' }}>
                Top-rated AI tools curated directly from developer community signals.
              </p>
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

          {/* ── 3 Core Search Dimensions (Tools, Categories, Providers) ── */}
          <section style={{ marginBottom: '6.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="cal-hero-badge" style={{ marginBottom: '0.65rem' }}>
                <span>+ Explore Dimensions</span>
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 750, letterSpacing: '-0.035em', margin: 0 }}>
                Explore the AI Ecosystem Across 3 Dimensions
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '6px', maxWidth: '600px', margin: '6px auto 0' }}>
                Find exactly what you need—whether searching for specific tools, curated use cases, or model providers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                {
                  step: '01',
                  title: 'Search by Tools',
                  desc: 'Discover 2,700+ verified AI software applications—from coding copilots and autonomous agents to voice synthesis and image generators.',
                  href: '/tools',
                  cta: 'Explore tools',
                },
                {
                  step: '02',
                  title: 'Search by Categories',
                  desc: 'Browse hand-curated categories like AI Coding, Frontier LLMs, Creative Engines, and AI Automation to match your exact workflow needs.',
                  href: '/categories',
                  cta: 'Explore categories',
                },
                {
                  step: '03',
                  title: 'Search by Providers',
                  desc: 'Explore research labs and model providers—compare token pricing, context windows, and live model families across OpenAI, Anthropic, DeepSeek, and Google.',
                  href: '/providers',
                  cta: 'Explore providers',
                },
              ].map((card) => (
                <div key={card.step} className="how-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.04em',
                      marginBottom: '1rem',
                      fontFamily: "'Geist', sans-serif",
                      opacity: 0.85,
                    }}>
                      {card.step}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '10px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                      {card.desc}
                    </p>
                  </div>
                  <Link
                    href={card.href}
                    className="btn-secondary"
                    style={{
                      padding: '7px 15px',
                      borderRadius: '10px',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      width: 'fit-content',
                      marginTop: 'auto',
                    }}
                  >
                    {card.cta} <ChevronRight size={14} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                  </Link>
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
                Building an AI tool? List it on <span className="brand-text">toolstaq</span>
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
