'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import ToolLogo from '@/components/tools/ToolLogo';

interface BrandTool {
  slug: string;
  name: string;
  category: string;
  url: string;
  icon: string;
  favicon_url?: string | null;
}

const POOL: BrandTool[] = [
  { slug: 'chatgpt', name: 'ChatGPT', category: 'Frontier LLM', url: 'https://chatgpt.com', icon: '🤖' },
  { slug: 'claude-ai-anthropic', name: 'Claude', category: 'AI Agents', url: 'https://claude.ai', icon: '🧠' },
  { slug: 'midjourney', name: 'Midjourney', category: 'Image Generation', url: 'https://midjourney.com', icon: '🎨' },
  { slug: 'cursor', name: 'Cursor', category: 'Code Editor', url: 'https://cursor.com', icon: '💻' },
  { slug: 'perplexity-ai', name: 'Perplexity', category: 'AI Search', url: 'https://perplexity.ai', icon: '🔍' },
  { slug: 'runway', name: 'Runway', category: 'Video Generation', url: 'https://runwayml.com', icon: '🎬' },
  { slug: 'flux-1-black-forest-labs', name: 'Flux', category: 'Image Generation', url: 'https://blackforestlabs.ai', icon: '⚡' },
  { slug: 'deepseek', name: 'DeepSeek', category: 'Open Models', url: 'https://deepseek.com', icon: '🐋' },
  { slug: 'elevenlabs', name: 'ElevenLabs', category: 'Voice Synthesis', url: 'https://elevenlabs.io', icon: '🎙️' },
  { slug: 'v0-by-vercel', name: 'v0', category: 'UI Generator', url: 'https://v0.dev', icon: '📐' },
  { slug: 'lovable', name: 'Lovable', category: 'App Builder', url: 'https://lovable.dev', icon: '✨' },
  { slug: 'sora-openai', name: 'Sora', category: 'Video Generation', url: 'https://openai.com/sora', icon: '🎥' },
];

export default function RotatingBrandGrid() {
  // 5 visible slots
  const [slots, setSlots] = useState<BrandTool[]>(POOL.slice(0, 5));
  const [isPaused, setIsPaused] = useState(false);
  const slotIndexRef = useRef(0);
  const poolPointerRef = useRef(5);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSlots((currentSlots) => {
        const slotIndexToSwap = slotIndexRef.current % 5;
        const currentSlugs = new Set(currentSlots.map(s => s.slug));
        
        let nextTool: BrandTool | undefined;
        for (let i = 0; i < POOL.length; i++) {
          const candidateIdx = (poolPointerRef.current + i) % POOL.length;
          const candidate = POOL[candidateIdx];
          if (!currentSlugs.has(candidate.slug)) {
            nextTool = candidate;
            poolPointerRef.current = (candidateIdx + 1) % POOL.length;
            break;
          }
        }
        
        if (!nextTool) return currentSlots;
        
        const nextSlots = [...currentSlots];
        nextSlots[slotIndexToSwap] = nextTool;
        slotIndexRef.current = (slotIndexRef.current + 1) % 5;
        return nextSlots;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          margin: 0,
          opacity: 0.85,
        }}>
          The Most Innovative Tools in the World
        </p>
      </div>

      {/* 5-Column Superhuman-Style Border Matrix */}
      <div className="rotating-grid-container">
        {slots.map((tool, idx) => (
          <div key={idx} className="rotating-grid-cell">
            <AnimatePresence mode="wait">
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', height: '100%' }}
              >
                <Link href={`/tools/${tool.slug}`} className="rotating-grid-link">
                  <ToolLogo
                    url={tool.url}
                    icon={tool.icon}
                    favicon_url={tool.favicon_url ?? undefined}
                    size={30}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span className="rotating-tool-name">
                      {tool.name}
                    </span>
                    <span className="rotating-tool-cat">
                      {tool.category}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      <style>{`
        .rotating-grid-container {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          overflow: hidden;
        }
        [data-theme='dark'] .rotating-grid-container {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 640px) {
          .rotating-grid-container {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .rotating-grid-cell {
          height: 68px;
          border-bottom: 1px solid var(--border-subtle);
          border-right: none;
          position: relative;
        }
        @media (min-width: 640px) {
          .rotating-grid-cell {
            border-bottom: none;
            border-right: 1px solid var(--border-subtle);
          }
          .rotating-grid-cell:last-child {
            border-right: none;
          }
        }

        .rotating-grid-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 1rem;
          height: 100%;
          text-decoration: none;
          transition: background 150ms ease;
        }
        .rotating-grid-link:hover {
          background: var(--bg-secondary);
        }
        [data-theme='dark'] .rotating-grid-link:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .rotating-tool-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rotating-tool-cat {
          font-size: 0.70rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
