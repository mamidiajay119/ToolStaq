'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ToolLogo from '@/components/tools/ToolLogo';
import UpvoteButton from '@/components/tools/UpvoteButton';
import ShareButton from '@/components/tools/ShareButton';

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
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [toolSlug]);

  return (
    <>
      <style>{`
        .tool-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.5rem 2.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: visible;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .tool-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        .tool-hero-top-badges {
          position: absolute;
          top: 2rem;
          right: 2.25rem;
          display: flex;
          gap: 6px;
          align-items: center;
          z-index: 5;
        }
        @media (max-width: 640px) {
          .tool-hero-card { padding: 2rem 1.5rem; }
          .tool-hero-top-badges {
            position: static;
            margin-bottom: 0.75rem;
          }
        }

        .tool-category-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 12px;
          border-radius: 99px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: border-color 150ms ease, color 150ms ease;
        }
        .tool-category-pill:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
      `}</style>

      <motion.div
        className="tool-hero-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        {/* Top-Right Status Badges */}
        {(isRecommended || isNew || openSource) && (
          <div className="tool-hero-top-badges">
            {isRecommended && (
              <span className="monochrome-pill-badge">
                <span>+ Recommended</span>
              </span>
            )}
            {isNew && (
              <span className="monochrome-pill-badge">
                <span>+ New</span>
              </span>
            )}
            {openSource && (
              <span className="monochrome-pill-badge">
                <span>+ Open Source</span>
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease, delay: 0.08 }}
          >
            <ToolLogo
              url={toolUrl}
              icon={toolIcon ?? '🤖'}
              favicon_url={toolFaviconUrl ?? undefined}
              size={76}
              borderRadius={16}
            />
          </motion.div>

          <div style={{ flex: 1, minWidth: '280px' }}>

            {/* Name row */}
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.1 }}
            >
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.035em', margin: 0, color: 'var(--text-primary)' }}>
                {toolName}
              </h1>
            </motion.div>

            {/* Subtitle */}
            {toolTitle && (
              <motion.h2
                style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: '1.15rem', marginTop: 0, lineHeight: 1.5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.16 }}
              >
                {toolTitle}
              </motion.h2>
            )}

            {/* Category badges */}
            <motion.div
              style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}
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
                  <Link href={`/category/${slug}`} style={{ textDecoration: 'none' }}>
                    <span className="tool-category-pill">{cat}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}
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
                  style={{ padding: '8px 18px', fontSize: '0.85rem', gap: '6px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                >
                  Visit {toolName} <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
                </motion.a>,

                <motion.div
                  key="upvote"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                >
                  <UpvoteButton toolSlug={toolSlug} initialUpvotes={baseUpvotes} />
                </motion.div>,

                <motion.div
                  key="share"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                >
                  <ShareButton toolName={toolName} toolTitle={toolTitle || ''} toolSlug={toolSlug} />
                </motion.div>,
              ].filter(Boolean)}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
