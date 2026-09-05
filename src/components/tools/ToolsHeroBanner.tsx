'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight } from 'lucide-react';
import ToolLogo from '@/components/tools/ToolLogo';

interface ToolsHeroBannerProps {
  search: string;
  setSearch: (s: string) => void;
  setPage: (p: number) => void;
  totalCount: number;
}

interface GridTool {
  name: string;
  query: string;
  category: string;
  bgColor: string;
  url: string;
  icon: string;
}

const FEATURED_GRID_TOOLS: GridTool[] = [
  { name: 'ChatGPT', query: 'ChatGPT', category: 'Frontier LLM', bgColor: '#10A37F', url: 'https://chatgpt.com', icon: '🤖' },
  { name: 'Claude', query: 'Claude', category: 'AI Agents', bgColor: '#D97757', url: 'https://claude.ai', icon: '🧠' },
  { name: 'Gemini', query: 'Gemini', category: 'Multimodal AI', bgColor: '#4285F4', url: 'https://gemini.google.com', icon: '✨' },
  { name: 'Cursor', query: 'Cursor', category: 'Code Editor', bgColor: '#09090B', url: 'https://cursor.com', icon: '💻' },
  { name: 'Perplexity', query: 'Perplexity', category: 'AI Search', bgColor: '#173A42', url: 'https://perplexity.ai', icon: '🔍' },
  { name: 'v0', query: 'v0', category: 'UI Generation', bgColor: '#000000', url: 'https://v0.dev', icon: '⚡' },
  { name: 'Runway', query: 'Runway', category: 'Video Gen', bgColor: '#18181B', url: 'https://runwayml.com', icon: '🎬' },
  { name: 'ElevenLabs', query: 'ElevenLabs', category: 'Voice AI', bgColor: '#2E1065', url: 'https://elevenlabs.io', icon: '🎙️' },
  { name: 'Flux', query: 'Black Forest Labs', category: 'Image Gen', bgColor: '#0f172a', url: 'https://blackforestlabs.ai', icon: '🖼️' },
  { name: 'DeepSeek', query: 'DeepSeek', category: 'Reasoning AI', bgColor: '#1e293b', url: 'https://deepseek.com', icon: '🐋' },
  { name: 'Lovable', query: 'Lovable', category: 'App Builder', bgColor: '#f43f5e', url: 'https://lovable.dev', icon: '✨' },
  { name: 'Bolt.new', query: 'Bolt', category: 'Fullstack AI', bgColor: '#eab308', url: 'https://bolt.new', icon: '⚡' },
  { name: 'Replit', query: 'Replit', category: 'Cloud IDE', bgColor: '#0f172a', url: 'https://replit.com', icon: '🚀' },
  { name: 'Gamma', query: 'Gamma', category: 'AI Presentations', bgColor: '#7c3aed', url: 'https://gamma.app', icon: '📊' },
];

export default function ToolsHeroBanner({ search, setSearch, setPage, totalCount }: ToolsHeroBannerProps) {
  // 4 visible slots in 2x2 matrix with Superhuman live rotation
  const [matrixSlots, setMatrixSlots] = useState<GridTool[]>(() => FEATURED_GRID_TOOLS.slice(0, 4));
  const [isMatrixPaused, setIsMatrixPaused] = useState(false);

  useEffect(() => {
    if (isMatrixPaused || FEATURED_GRID_TOOLS.length < 4) return;

    const interval = setInterval(() => {
      const slotToSwap = Math.floor(Math.random() * 4);

      setMatrixSlots((currentSlots) => {
        const currentNames = new Set(currentSlots.map((s) => s.name));
        const available = FEATURED_GRID_TOOLS.filter((t) => !currentNames.has(t.name));
        if (available.length === 0) return currentSlots;

        const nextTool = available[Math.floor(Math.random() * available.length)];
        const nextSlots = [...currentSlots];
        nextSlots[slotToSwap] = nextTool;
        return nextSlots;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isMatrixPaused]);

  const handleToolClick = (query: string) => {
    setSearch(query);
    setPage(1);
    const gridEl = document.getElementById('tools-directory-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .tools-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .tools-hero-card {
          background: linear-gradient(135deg, #130f24 0%, #1a1432 50%, #140f26 100%);
          border: 1px solid rgba(139, 92, 246, 0.25);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .tools-hero-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .tools-hero-layout {
            grid-template-columns: 1.15fr 0.85fr;
          }
        }

        .tools-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .tools-hero-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 520px;
        }

        .tools-search-bar {
          width: 100%;
          padding: 11px 14px 11px 40px;
          font-size: 0.9rem;
          border-radius: 12px;
          border: var(--border-width, 1px) solid var(--border-subtle);
          background: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .tools-search-bar:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
        }

        .tools-hero-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .tools-matrix-cell {
          height: 115px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 1rem;
          text-decoration: none;
          cursor: pointer;
        }
        .cell-top-left { border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
        .cell-top-right { border-bottom: 1px solid var(--border-subtle); }
        .cell-bot-left { border-right: 1px solid var(--border-subtle); }

        .tools-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--border-subtle);
          font-size: 16px;
          font-weight: 300;
          font-family: monospace;
          pointer-events: none;
          z-index: 5;
          user-select: none;
        }
      `}</style>

      <div className="tools-hero-card">
        <div className="tools-hero-layout">
          {/* Left Column: Pill, Headline, Subtitle, CTAs, Search */}
          <div>
            <div className="monochrome-pill-badge" style={{ marginBottom: '1rem' }}>
              <span>+ AI Directory</span>
            </div>

            <h1 className="tools-hero-heading">
              The right AI tools to power
              <br />
              your workflow
            </h1>

            <p className="tools-hero-desc">
              Explore and connect over {totalCount > 0 ? totalCount.toLocaleString() : '2,700'}+ verified AI tools.
              Categorized across models, coding copilots, creative engines, and autonomous agents.
            </p>

            {/* Action CTAs */}
            <div className="banner-cta-group" style={{ marginBottom: '1.75rem' }}>
              <button
                onClick={() => {
                  const gridEl = document.getElementById('tools-directory-grid');
                  if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary banner-cta-btn"
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  minWidth: '175px',
                }}
              >
                Explore tools <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
              </button>
              <a
                href="/submit"
                className="btn-secondary banner-cta-btn"
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minWidth: '175px',
                }}
              >
                Submit a tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
              </a>
            </div>

            {/* Integrated Search Bar */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={`Search ${totalCount > 0 ? totalCount.toLocaleString() : '2,700'}+ AI tools...`}
                className="tools-search-bar"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: 2x2 Matrix with Superhuman Live Rotation */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={() => setIsMatrixPaused(true)}
            onMouseLeave={() => setIsMatrixPaused(false)}
          >
            <div className="tools-hero-matrix">
              {matrixSlots.map((tool, idx) => {
                const cellClasses = ['cell-top-left', 'cell-top-right', 'cell-bot-left', ''];
                const cellClass = cellClasses[idx];

                return (
                  <div
                    key={idx}
                    className={`tools-matrix-cell ${cellClass}`}
                    onClick={() => handleToolClick(tool.query)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 6, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.94 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <ToolLogo
                          url={tool.url}
                          icon={tool.icon}
                          size={42}
                          borderRadius={12}
                        />
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                          {tool.name}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Center Crosshair */}
              <div className="tools-crosshair">+</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
