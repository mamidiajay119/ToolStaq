'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <section style={{ paddingTop: '3.5rem', marginBottom: '7.5rem' }}>
      {/* Section header — fades in when scrolled into view */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, ease }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>Browse by Category</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{totalCategories} categories covering every AI use case</p>
        </div>
        <Link href="/tools" className="btn-ghost" style={{ color: 'var(--accent-violet)', fontSize: '0.825rem' }}>
          View all <ArrowRight size={14} />
        </Link>
      </motion.div>

      {/* Cards — stagger cascade on scroll into view */}
      <motion.div
        className="category-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
        }}
      >
        {categoryItems.map(({ cat, slug, count }) => (
          <motion.div
            key={cat}
            variants={{
              hidden: { opacity: 0, y: 22, scale: 0.97 },
              show: {
                opacity: 1, y: 0, scale: 1,
                transition: { duration: 0.42, ease },
              },
            }}
          >
            <Link href={`/category/${slug}`} className="cat-card" style={{ height: '100%' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
                    overflow: 'hidden', margin: 0, marginBottom: '6px',
                  }}>
                    {CATEGORY_SHORT_DESCRIPTIONS[cat]}
                  </p>
                )}
                <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                  <span style={{
                    display: 'inline-block', fontSize: '0.7rem', fontWeight: 600,
                    color: 'var(--text-secondary)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
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
