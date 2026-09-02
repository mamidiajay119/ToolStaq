'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, X, Sparkles, Terminal, Bot, Image as ImageIcon, Cpu, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  totalTools: number;
  totalCategories: number;
}

const HERO_FEATURED_CATEGORIES = [
  {
    title: 'Coding Assistants',
    badge: 'Popular',
    icon: Terminal,
    color: '#8b5cf6',
    count: '340+ tools',
    tools: ['Cursor', 'GitHub Copilot', 'v0.dev', 'Claude Code'],
  },
  {
    title: 'Autonomous Agents',
    badge: 'Trending',
    icon: Bot,
    color: '#0891b2',
    count: '210+ tools',
    tools: ['Devin AI', 'CrewAI', 'AutoGPT', 'Manus AI'],
  },
  {
    title: 'Creative Generators',
    badge: 'Hot',
    icon: ImageIcon,
    color: '#059669',
    count: '480+ tools',
    tools: ['Midjourney v6', 'Runway Gen-3', 'Flux.1', 'Sora AI'],
  },
  {
    title: 'Frontier Models',
    badge: 'Core',
    icon: Cpu,
    color: '#ea580c',
    count: '150+ models',
    tools: ['ChatGPT o3', 'Gemini 1.5 Pro', 'Claude 3.5', 'Llama 3.3'],
  },
];

export default function HeroSection({ totalTools, totalCategories }: HeroSectionProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      router.push(`/tools?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/tools');
    }
  };

  return (
    <section className="cal-hero-wrapper">
      <style>{`
        /* ── Cal.com Inspired Full-Hero Wrapper ── */
        .cal-hero-wrapper {
          position: relative;
          width: 100%;
          padding: 3rem 0 2rem;
          overflow: hidden;
        }

        /* Ambient Glow Mesh Background */
        .cal-hero-bg-glow {
          position: absolute;
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          width: 1100px;
          height: 600px;
          background: radial-gradient(ellipse at 50% 20%, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0.02) 50%, transparent 75%);
          pointer-events: none;
          z-index: 0;
        }
        [data-theme='dark'] .cal-hero-bg-glow {
          background: 
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(167, 139, 250, 0.06) 0%, transparent 70%);
        }

        .cal-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
        }

        /* Top Monochrome Pill Badge (Cal.com style) */
        .cal-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 14px;
          border-radius: 99px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          font-size: 0.76rem;
          font-weight: 500;
          color: #18181b;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .cal-hero-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          color: #ededed;
        }

        .cal-badge-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        /* Cal.com Typography */
        .cal-hero-heading {
          font-size: 2.6rem;
          font-weight: 750;
          line-height: 1.12;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          margin: 0 0 1.25rem 0;
        }
        @media (min-width: 640px) {
          .cal-hero-heading {
            font-size: 3.5rem;
          }
        }
        @media (min-width: 1024px) {
          .cal-hero-heading {
            font-size: 4rem;
          }
        }

        .cal-text-highlight {
          background: linear-gradient(135deg, #18181b 0%, #52525b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        [data-theme='dark'] .cal-text-highlight {
          background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cal-hero-sub {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 660px;
          margin: 0 0 2.25rem 0;
          letter-spacing: -0.01em;
        }
        @media (min-width: 640px) {
          .cal-hero-sub {
            font-size: 1.15rem;
          }
        }

        /* Central Search Input Container (Cal.com Embed Style) */
        .cal-search-box {
          position: relative;
          width: 100%;
          max-width: 580px;
          margin: 0 auto 1.5rem;
        }
        .cal-search-input {
          width: 100%;
          padding: 14px 18px 14px 48px;
          font-size: 0.95rem;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          outline: none;
          transition: all 180ms ease;
        }
        .cal-search-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18), 0 8px 25px rgba(0, 0, 0, 0.08);
        }
        [data-theme='dark'] .cal-search-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        [data-theme='dark'] .cal-search-input:focus {
          border-color: #a78bfa;
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2), 0 8px 30px rgba(0, 0, 0, 0.5);
        }

        /* Action Buttons */
        .cal-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        /* Interactive Showcase Dashboard Card (Cal.com AI style) */
        .cal-showcase-card {
          width: 100%;
          max-width: 1180px;
          margin: 1.5rem auto 0;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        [data-theme='dark'] .cal-showcase-card {
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          background: rgba(18, 18, 22, 0.7);
          backdrop-filter: blur(12px);
        }

        .cal-showcase-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 12px;
        }

        .cal-window-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cal-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .cal-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          text-align: left;
        }
        @media (min-width: 640px) {
          .cal-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .cal-showcase-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .cal-feature-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.25rem;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          text-decoration: none;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        .cal-feature-box:hover {
          transform: translateY(-3px);
          border-color: var(--accent-primary);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        [data-theme='dark'] .cal-feature-box:hover {
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
        }

        .cal-tag-pill {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 99px;
          background: rgba(0, 0, 0, 0.06);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        [data-theme='dark'] .cal-tag-pill {
          background: rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
        }
      `}</style>

      <div className="cal-hero-bg-glow" />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Hero Header */}
        <div className="cal-hero-content">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="cal-hero-badge"
          >
            <span className="cal-badge-pulse" />
            <span>Built for modern AI workflows</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="cal-hero-heading"
          >
            The intelligent index for <br />
            <span className="cal-text-highlight">frontier AI tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="cal-hero-sub"
          >
            Discover, compare, and integrate over {totalTools > 0 ? totalTools.toLocaleString() : '2,700'}+ verified AI software tools across {totalCategories} handpicked categories.
          </motion.p>

          {/* Interactive Search Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="cal-search-box"
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${totalTools > 0 ? totalTools.toLocaleString() : '2,700'}+ AI tools by model, code, image, agent...`}
              className="cal-search-input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={16} />
              </button>
            )}
          </motion.form>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="cal-cta-group"
          >
            <Link
              href="/tools"
              className="btn-primary"
              style={{
                padding: '10px 22px',
                borderRadius: '12px',
                fontSize: '0.90rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Explore directory <ChevronRight size={16} strokeWidth={2.5} style={{ opacity: 0.75 }} />
            </Link>
            <Link
              href="/submit"
              className="btn-secondary"
              style={{
                padding: '10px 22px',
                borderRadius: '12px',
                fontSize: '0.90rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Submit AI tool <ChevronRight size={16} strokeWidth={2.5} style={{ opacity: 0.75 }} />
            </Link>
          </motion.div>
        </div>

        {/* Live Interactive Command Center Showcase Card (Cal.com AI / Embed Inspired) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="cal-showcase-card"
        >
          <div className="cal-showcase-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="cal-window-dots">
                <div className="cal-dot" style={{ background: '#ef4444' }} />
                <div className="cal-dot" style={{ background: '#f59e0b' }} />
                <div className="cal-dot" style={{ background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                toolstaq.com / intelligence-index
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <CheckCircle2 size={13} /> {totalTools > 0 ? totalTools.toLocaleString() : '2,729'} AI Tools Indexed
              </span>
            </div>
          </div>

          {/* 4 Feature Matrix Grid Cards */}
          <div className="cal-showcase-grid">
            {HERO_FEATURED_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.title} href="/tools" className="cal-feature-box">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: cat.color,
                      }}>
                        <Icon size={18} />
                      </div>
                      <span className="cal-tag-pill">{cat.badge}</span>
                    </div>

                    <h3 style={{ fontSize: '0.975rem', fontWeight: 650, margin: '0 0 4px 0' }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                      {cat.count}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {cat.tools.map((t) => (
                        <span key={t} style={{
                          fontSize: '0.68rem', fontWeight: 500, padding: '2px 6px', borderRadius: '5px',
                          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
