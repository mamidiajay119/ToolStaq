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
  if (!cat) return { title: 'Category Not Found' };
  const tools = await getToolsByCategory(cat);
  return {
    title: `${cat} Tools — ${tools.length} AI Tools for ${cat.replace('AI ', '')}`,
    description: `Browse ${tools.length} ${cat} tools. Compare pricing, features, and find the best ${cat} tool for your workflow.`,
    alternates: { canonical: `https://aitoolsdirectory.com/category/${slug}` },
  };
}


export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  if (!cat) notFound();

  const tools = await getToolsByCategory(cat);
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
      `}</style>

      {/* Hero */}
      <div className="inner-hero" style={{ marginBottom: '2.5rem', display: 'block', textAlign: 'left' }}>
        <div className="container-xl">
          {/* Breadcrumbs */}
          <nav style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/categories" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Categories</Link>
            <span>/</span>
            <span style={{ color: '#FFFFFF' }}>{cat}</span>
          </nav>
          
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}>
              <CategoryIcon category={cat} size={30} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 400, letterSpacing: '-0.03em', margin: 0, color: '#FFFFFF', lineHeight: 1.1 }}>{cat}</h1>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)' }}>{tools.length} tools</span>
            </div>
          </div>

          {/* Description stacked below, taking 100% width to expand horizontally and reduce vertical row height */}
          <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7, fontSize: '0.9rem', width: '100%', maxWidth: 'none', margin: '0', textAlign: 'left' }}>
            {CATEGORY_LONG_DESCRIPTIONS[cat] ? (
              CATEGORY_LONG_DESCRIPTIONS[cat].split('\n\n').map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0, marginBottom: '0.75rem', maxWidth: 'none' }}>{paragraph}</p>
              ))
            ) : (
              <p style={{ margin: 0, maxWidth: 'none' }}>{desc}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        
        {/* Horizontal Category Chips */}
        <div className="hide-scroll" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '1.5rem', marginBottom: '1rem', borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)' }}>
          <Link
            href="/tools"
            className="btn-secondary"
            style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            All Categories
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c}
              href={`/category/${slugifyCategory(c)}`}
              className={c === cat ? "btn-primary" : "btn-secondary"}
              style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
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
