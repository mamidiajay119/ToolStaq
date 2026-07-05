import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, getCategoryCounts, slugifyCategory } from '@/lib/tools';
import { CATEGORY_SHORT_DESCRIPTIONS } from '@/lib/category-content';
import CategoryIcon from '@/components/ui/CategoryIcon';

export const metadata: Metadata = {
  title: 'All AI Categories — Find Tools by Use Case',
  description: 'Browse all 27 categories of AI tools, from AI writing and coding to video generation and marketing.',
};

export default function CategoriesIndexPage() {
  const categories = getAllCategories();
  const counts = getCategoryCounts();

  return (
    <div className="container-xl" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          AI Categories
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Find the perfect AI tool for your specific workflow.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '20px',
      }}>
        {categories.map((cat) => {
          const count = counts[cat] || 0;
          return (
            <Link
              key={cat}
              href={`/category/${slugifyCategory(cat)}`}
              className="cat-card"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                textDecoration: 'none',
                transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
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
      
      <style>{`
        .cat-card:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
      `}</style>
    </div>
  );
}
