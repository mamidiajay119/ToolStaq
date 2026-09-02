'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import ToolLogo from '@/components/tools/ToolLogo';
import UpvoteButton from '@/components/tools/UpvoteButton';

interface ToolHeroProps {
  toolName: string;
  toolSlug: string;
  toolUrl: string;
  toolIcon: string | null;         // null → emoji fallback handled inside ToolLogo
  toolFaviconUrl: string | null;  // null → undefined for ToolLogo
  toolTitle: string | null | undefined;
  categories: { cat: string; slug: string }[];
  isRecommended: boolean;
  isNew: boolean;
  openSource: boolean;
  baseUpvotes: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function ToolHero({
  toolName, toolSlug, toolUrl, toolIcon, toolFaviconUrl,
  toolTitle, categories, isRecommended, isNew, openSource, baseUpvotes,
}: ToolHeroProps) {
  return (
    <motion.div
      className="tool-hero-card"
      style={{ borderRadius: '16px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>

        {/* Logo — pops in with a slight scale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
        >
          <ToolLogo
            url={toolUrl}
            icon={toolIcon ?? '🤖'}
            favicon_url={toolFaviconUrl ?? undefined}
            size={80}
          />
        </motion.div>

        <div style={{ flex: 1, minWidth: '300px' }}>

          {/* Name + badges row */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.1 }}
          >
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>
              {toolName}
            </h1>
            {isRecommended && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-emerald)',
                background: 'rgba(5, 150, 105, 0.08)',
                border: 'var(--border-width, 1px) solid rgba(5, 150, 105, 0.2)',
                padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase',
                letterSpacing: '0.04em', lineHeight: 1.2,
              }}>
                Recommended
              </span>
            )}
            {isNew && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)',
                background: 'rgba(139, 92, 246, 0.08)',
                border: 'var(--border-width, 1px) solid rgba(139, 92, 246, 0.2)',
                padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase',
                letterSpacing: '0.04em', lineHeight: 1.2,
              }}>
                New
              </span>
            )}
            {openSource && <span className="badge badge-emerald">Open Source</span>}
          </motion.div>

          {/* Subtitle */}
          {toolTitle && (
            <motion.h2
              style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.16 }}
            >
              {toolTitle}
            </motion.h2>
          )}

          {/* Category badges — stagger */}
          <motion.div
            style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
            }}
          >
            {categories.map(({ cat, slug }) => (
              <motion.div
                key={cat}
                variants={{
                  hidden: { opacity: 0, scale: 0.88 },
                  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
                }}
              >
                <Link href={`/category/${slug}`}>
                  <span className="badge badge-violet">{cat}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons — stagger */}
          <motion.div
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1.5rem' }}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: 0.28 } },
            }}
          >
            {[
              <motion.a
                key="visit"
                href={`/go/${toolSlug}`}
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '7px 16px', fontSize: '0.825rem', gap: '6px', height: '36px', display: 'flex', alignItems: 'center' }}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
              >
                <ExternalLink size={13} /> Visit {toolName}
              </motion.a>,

              <motion.div
                key="upvote"
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
              >
                <UpvoteButton toolSlug={toolSlug} initialUpvotes={baseUpvotes} />
              </motion.div>,

              isRecommended && (
                <motion.div
                  key="top-pick"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '12px', height: '36px',
                    border: 'var(--border-width, 1px) solid rgba(16, 185, 129, 0.2)',
                    background: 'rgba(16, 185, 129, 0.04)',
                    color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600,
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  Top Pick
                </motion.div>
              ),

              <motion.div
                key="compare"
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
              >
                <Link
                  href={`/compare?tool=${toolSlug}`}
                  className="btn-secondary"
                  style={{ padding: '7px 16px', fontSize: '0.825rem', height: '36px', display: 'flex', alignItems: 'center' }}
                >
                  Compare Tools
                </Link>
              </motion.div>,
            ].filter(Boolean)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
