import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, getToolsByCategory, categoryFromSlug, slugifyCategory } from '@/lib/tools';
import { CATEGORY_LONG_DESCRIPTIONS, CATEGORY_SHORT_DESCRIPTIONS } from '@/lib/category-content';
import CategoryIcon from '@/components/ui/CategoryIcon';
import CategoryToolsClient from './CategoryToolsClient';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: slugifyCategory(cat) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  const tools = await getToolsByCategory(cat);
  if (!cat || !tools || tools.length === 0) return { title: 'Category Not Found' };
  return {
    title: `${cat} Tools — ${tools.length} AI Tools for ${cat.replace('AI ', '')}`,
    description: `Browse ${tools.length} ${cat} tools. Compare pricing, features, and find the best ${cat} tool for your workflow.`,
    alternates: { canonical: `https://aitoolsdirectory.com/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  const tools = await getToolsByCategory(cat);

  if (!cat || !tools || tools.length === 0) {
    notFound();
  }
  const desc = CATEGORY_SHORT_DESCRIPTIONS[cat] || `Browse ${tools.length} AI tools in the ${cat} category.`;
  const allCategories = getAllCategories();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat} Tools`,
    description: desc,
    url: `https://aitoolsdirectory.com/category/${slug}`,
    numberOfItems: tools.length,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Hero Card Banner Standard ── */
        .single-category-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .single-category-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .single-category-hero-card { padding: 2rem 1.5rem; }
        }

        .single-category-breadcrumb {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
        }
        .single-category-breadcrumb a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 150ms ease;
        }
        .single-category-breadcrumb a:hover {
          color: var(--accent-primary);
        }

        .single-category-pill-badge {
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
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .single-category-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .single-category-header-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .single-category-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .single-category-hero-heading {
          font-size: 1.35rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          margin: 0;
        }
        @media (min-width: 640px) {
          .single-category-hero-heading { font-size: 1.65rem; }
        }

        .single-category-count {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 99px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .single-category-desc {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 0.95rem;
          margin-top: 1.25rem;
          width: 100%;
          max-width: 100%;
        }
        .single-category-desc p {
          margin: 0 0 0.75rem 0;
        }
        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          flex-wrap: nowrap;
          white-space: nowrap;
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-pills-row::-webkit-scrollbar {
          display: none;
        }

        .category-pill-btn {
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
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.03);
          color: #3f3f46;
          text-decoration: none;
        }

        .category-pill-btn:hover {
          border-color: rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          color: #09090b;
        }

        .category-pill-btn.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
        }

        [data-theme='dark'] .category-pill-btn {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          color: #a1a1aa;
        }
        [data-theme='dark'] .category-pill-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.2);
          color: #f4f4f5;
        }
        [data-theme='dark'] .category-pill-btn.active {
          background: #ffffff;
          border-color: #ffffff;
          color: #09090b;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Hero Card Banner */}
      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '1.5rem' }}>
        {/* Breadcrumbs outside banner */}
        <nav className="single-category-breadcrumb" style={{ marginBottom: '1.25rem' }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/categories">Categories</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cat}</span>
        </nav>

        <div className="single-category-hero-card">
          {/* Header Row */}
          <div className="single-category-header-row">
            <div className="single-category-icon-box">
              <CategoryIcon category={cat} size={24} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 className="single-category-hero-heading">{cat}</h1>
              <span className="single-category-count">{tools.length} tools</span>
            </div>
          </div>

          {/* Description */}
          <div className="single-category-desc">
            {CATEGORY_LONG_DESCRIPTIONS[cat] ? (
              CATEGORY_LONG_DESCRIPTIONS[cat].split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <p>{desc}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: '0.5rem', paddingBottom: '1.5rem' }}>
        
        {/* Horizontal Category Chips matching Tools and AI News pages */}
        <div className="category-pills-row">
          <Link
            href="/tools"
            className="category-pill-btn"
          >
            All Categories
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c}
              href={`/category/${slugifyCategory(c)}`}
              className={`category-pill-btn ${c === cat ? "active" : ""}`}
            >
              {c.replace('AI ', '')}
            </Link>
          ))}
        </div>

        <CategoryToolsClient tools={tools} />
      </div>
    </>
  );
}
