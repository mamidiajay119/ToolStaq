'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
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
  {
    name: 'ChatGPT',
    query: 'ChatGPT',
    category: 'Frontier LLM',
    bgColor: '#10A37F',
    url: 'https://chatgpt.com',
    icon: '🤖',
  },
  {
    name: 'Claude',
    query: 'Claude',
    category: 'AI Agents',
    bgColor: '#D97757',
    url: 'https://claude.ai',
    icon: '🧠',
  },
  {
    name: 'Midjourney',
    query: 'Midjourney',
    category: 'Image Gen',
    bgColor: '#1E1B4B',
    url: 'https://midjourney.com',
    icon: '🎨',
  },
  {
    name: 'Cursor',
    query: 'Cursor',
    category: 'Code Editor',
    bgColor: '#09090B',
    url: 'https://cursor.com',
    icon: '💻',
  },
  {
    name: 'Perplexity',
    query: 'Perplexity',
    category: 'AI Search',
    bgColor: '#173A42',
    url: 'https://perplexity.ai',
    icon: '🔍',
  },
  {
    name: 'v0',
    query: 'v0',
    category: 'UI Generation',
    bgColor: '#000000',
    url: 'https://v0.dev',
    icon: '⚡',
  },
  {
    name: 'Runway',
    query: 'Runway',
    category: 'Video Gen',
    bgColor: '#18181B',
    url: 'https://runwayml.com',
    icon: '🎬',
  },
  {
    name: 'ElevenLabs',
    query: 'ElevenLabs',
    category: 'Voice AI',
    bgColor: '#2E1065',
    url: 'https://elevenlabs.io',
    icon: '🎙️',
  },
];

export default function ToolsHeroBanner({ search, setSearch, setPage, totalCount }: ToolsHeroBannerProps) {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const handleToolClick = (query: string) => {
    setSearch(query);
    setPage(1);
    // Smooth scroll down to the filters/grid
    const gridEl = document.getElementById('tools-directory-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="tools-hero-card">
      <div className="tools-hero-layout">
        {/* Left Column: Pill, Headline, Subtitle, CTAs, Search */}
        <div className="tools-hero-left">
          <div className="tools-pill-badge">
            <span>+ AI directory</span>
          </div>

          <h1 className="tools-hero-heading">
            The right AI tools to power your workflow
          </h1>

          <p className="tools-hero-desc">
            Explore and connect over {totalCount > 0 ? totalCount.toLocaleString() : '2,700'}+ verified AI tools.
            Categorized across models, coding copilots, creative engines, and autonomous agents.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            <button
              onClick={() => {
                const gridEl = document.getElementById('tools-directory-grid');
                if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary"
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Explore tools <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
            </button>
            <a
              href="/submit"
              className="btn-secondary"
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Submit a tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
            </a>
          </div>

          {/* Integrated Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px', marginBottom: '0.85rem' }}>
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

        {/* Right Column: Animated Crosshair 4x2 Integration Grid */}
        <div className="tools-hero-right">
          <div className="tools-grid-box">
            {/* The 4x2 Grid */}
            <div className="tools-grid-matrix">
              {FEATURED_GRID_TOOLS.map((tool, idx) => {
                const isHovered = hoveredTool === tool.name;
                return (
                  <div
                    key={tool.name}
                    className={`tools-grid-cell cell-col-${(idx % 4) + 1} cell-row-${Math.floor(idx / 4) + 1}`}
                    onMouseEnter={() => setHoveredTool(tool.name)}
                    onMouseLeave={() => setHoveredTool(null)}
                    onClick={() => handleToolClick(tool.query)}
                    title={`Click to search ${tool.name}`}
                  >
                    {/* Continuous Floating Motion */}
                    <motion.div
                      animate={{ y: [0, -3.5, 0] }}
                      transition={{
                        duration: 3.2 + (idx % 3) * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: (idx % 4) * 0.25,
                      }}
                      whileHover={{ scale: 1.14, y: -6 }}
                      whileTap={{ scale: 0.94 }}
                      style={{
                        width: '52px',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <div className="tools-banner-logo-box">
                        <ToolLogo
                          url={tool.url}
                          icon={tool.icon}
                          size={50}
                          borderRadius={13}
                        />
                      </div>
                    </motion.div>

                    {/* Tooltip on hover */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="tools-cell-tooltip"
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tool.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{tool.category}</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Crosshairs at the 3 vertical/horizontal line intersections */}
            <div className="crosshair crosshair-1">+</div>
            <div className="crosshair crosshair-2">+</div>
            <div className="crosshair crosshair-3">+</div>
          </div>
        </div>
      </div>

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
          background: linear-gradient(135deg, #0d0a17 0%, #110d1e 50%, #0d0a17 100%);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .tools-hero-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 960px) {
          .tools-hero-layout {
            grid-template-columns: 1.15fr 0.85fr;
          }
        }

        .tools-pill-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 99px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.03);
          font-size: 0.70rem;
          font-weight: 500;
          color: #18181b;
          margin-bottom: 0.85rem;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .tools-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .tools-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }
        @media (min-width: 640px) {
          .tools-hero-heading {
            font-size: 2.85rem;
          }
        }

        .tools-hero-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 500px;
        }

        .tools-search-bar {
          width: 100%;
          padding: 10px 14px 10px 40px;
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

        /* ── Right Grid Box & Crosshairs ── */
        .tools-hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .tools-grid-box {
          position: relative;
          width: 100%;
          max-width: 460px;
        }

        .tools-grid-matrix {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
          position: relative;
        }

        .tools-grid-cell {
          height: 105px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .tools-banner-logo-box {
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }
        [data-theme='dark'] .tools-banner-logo-box {
          border: 1px solid rgba(255, 255, 255, 0.20);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }
        .tools-grid-cell:hover .tools-banner-logo-box {
          border-color: var(--accent-primary);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25);
        }

        /* Subtle grid lines matching reference screenshot */
        .cell-row-1 {
          border-bottom: 1px solid var(--border-subtle);
        }
        .cell-col-1, .cell-col-2, .cell-col-3 {
          border-right: 1px solid var(--border-subtle);
        }

        /* Crosshairs centered at the 3 column intersections along the dividing line */
        .crosshair {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          color: var(--border-subtle);
          font-size: 15px;
          font-weight: 300;
          font-family: monospace;
          pointer-events: none;
          z-index: 5;
          user-select: none;
        }
        .crosshair-1 { left: 25%; }
        .crosshair-2 { left: 50%; }
        .crosshair-3 { left: 75%; }

        .tools-cell-tooltip {
          position: absolute;
          bottom: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.72rem;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
