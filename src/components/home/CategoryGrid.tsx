'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { CATEGORY_SHORT_DESCRIPTIONS } from '@/lib/category-content';

interface CategoryItem {
  cat: string;
  slug: string;
  count: number;
}

interface CategoryGridProps {
  categoryItems: CategoryItem[];
  totalCategories: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function CategoryGrid({ categoryItems, totalCategories }: CategoryGridProps) {
  return (
    <section style={{ paddingTop: '2.5rem', marginBottom: '6rem' }}>
      {/* Section header — Cal.com inspired badge & clean title */}
      <motion.div
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease }}
      >
        <div>
          <div className="cal-hero-badge" style={{ marginBottom: '0.65rem' }}>
            <span>+ Explore categories</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
            Browse by AI Capability
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.90rem', margin: '4px 0 0 0' }}>
            {totalCategories} hand-curated categories covering every AI software engineering & business workflow.
          </p>
        </div>
        <Link href="/categories" className="btn-secondary" style={{ fontSize: '0.84rem', padding: '8px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          All categories <ChevronRight size={14} />
        </Link>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="category-grid"
        initial="show"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {categoryItems.map(({ cat, slug, count }) => (
          <motion.div
            key={cat}
            variants={{
              hidden: { opacity: 1, y: 0, scale: 1 },
              show: {
                opacity: 1, y: 0, scale: 1,
                transition: { duration: 0.2 },
              },
            }}
          >
            <Link href={`/category/${slug}`} className="cat-card" style={{ height: '100%' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}>
                <CategoryIcon category={cat} size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2, marginBottom: '4px' }}>
                  {cat.replace('AI ', '')}
                </h3>
                {CATEGORY_SHORT_DESCRIPTIONS[cat] && (
                  <p style={{
                    fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', margin: 0, marginBottom: '6px',
                  }}>
                    {CATEGORY_SHORT_DESCRIPTIONS[cat]}
                  </p>
                )}
                <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                  <span style={{
                    display: 'inline-block', fontSize: '0.7rem', fontWeight: 600,
                    color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)',
                    borderRadius: '99px', padding: '2px 8px', background: 'var(--bg-primary)',
                  }}>
                    {count} tools
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
