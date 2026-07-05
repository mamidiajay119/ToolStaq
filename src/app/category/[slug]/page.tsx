import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, getToolsByCategory, categoryFromSlug, slugifyCategory } from '@/lib/tools';
import { CATEGORY_LONG_DESCRIPTIONS, CATEGORY_SHORT_DESCRIPTIONS } from '@/lib/category-content';
import CategoryIcon from '@/components/ui/CategoryIcon';
import ToolCard from '@/components/tools/ToolCard';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: slugifyCategory(cat) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  if (!cat) return { title: 'Category Not Found' };
  const tools = getToolsByCategory(cat);
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

  const tools = getToolsByCategory(cat);
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
      <div style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3rem 1.5rem',
      }}>
        <div className="container-xl">
          <nav style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Categories</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)'
            }}>
              <CategoryIcon category={cat} size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>{cat}</h1>
              <span className="badge badge-violet">{tools.length} tools</span>
            </div>
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', width: '100%' }}>
            {CATEGORY_LONG_DESCRIPTIONS[cat] ? (
              CATEGORY_LONG_DESCRIPTIONS[cat].split('\n\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '0.75rem' }}>{paragraph}</p>
              ))
            ) : (
              <p>{desc}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        
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

        {/* Tool Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '14px',
          marginBottom: '4rem',
        }}>
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} rank={i < 3 ? i + 1 : undefined} />
          ))}
        </div>
      </div>
    </>
  );
}
