'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  totalTools: number;
  totalCategories: number;
}

// Shared easing for a fast-out, smooth-settle feel
const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection({ totalTools, totalCategories }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

        {/* Headline — slides down from above */}
        <motion.h1
          className="hero-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          Discover the right{' '}
          <span className="gradient-text-orange">AI Tools</span>
          <br />for every workflow
        </motion.h1>

        {/* Subheading — follows 80ms later */}
        <motion.p
          className="hero-subheading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.08 }}
        >
          Explore a curated index of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalTools.toLocaleString()}+ AI tools</strong>{' '}
          across{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalCategories} categories</strong>.
          {' '}Filter by pricing, complexity, and deployment to optimize your workflow.
        </motion.p>

        {/* CTA Buttons — stagger 40ms between each */}
        <motion.div
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease } },
            }}
          >
            <Link href="/tools" className="btn-primary" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
              <Search size={15} /> Browse
            </Link>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease } },
            }}
          >
            <Link href="/news" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
              Read <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Popular pills — cascade in last */}
        <motion.div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', flexWrap: 'wrap', maxWidth: '640px', margin: '0 auto',
          }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
          }}
        >
          <motion.span
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px', letterSpacing: '0.05em' }}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }}
          >
            popular:
          </motion.span>
          {[
            { label: 'writing', slug: 'ai-writing' },
            { label: 'coding', slug: 'ai-coding' },
            { label: 'design', slug: 'ai-design' },
            { label: 'video', slug: 'ai-video' },
            { label: 'productivity', slug: 'ai-productivity' },
            { label: 'marketing', slug: 'ai-marketing' },
          ].map((pill) => (
            <motion.div
              key={pill.slug}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
              }}
            >
              <Link href={`/category/${pill.slug}`} className="hero-pill">
                {pill.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
