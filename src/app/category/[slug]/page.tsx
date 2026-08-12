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
      <div className="inner-hero" style={{ padding: '3.5rem 1.5rem 4.5rem', marginBottom: '2.5rem', display: 'block' }}>
        <div className="container-xl">
          <nav style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/categories" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Categories</Link>
            <span>/</span>
            <span style={{ color: '#FFFFFF' }}>{cat}</span>
          </nav>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CategoryIcon category={cat} size={30} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: '6px', color: '#FFFFFF' }}>{cat}</h1>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)' }}>{tools.length} tools</span>
            </div>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7, fontSize: '0.9rem', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            {CATEGORY_LONG_DESCRIPTIONS[cat] ? (
              CATEGORY_LONG_DESCRIPTIONS[cat].split('\n\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '0.75rem' }}>{paragraph}</p>
              ))
            ) : (
              <p style={{ margin: 0 }}>{desc}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        
        {/* Horizontal Category Chips */}
        <div className="hide-scroll" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
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
