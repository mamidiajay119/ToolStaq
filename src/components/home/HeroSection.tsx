'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Terminal, Bot, Image as ImageIcon, Cpu, CheckCircle2, ArrowUpRight } from 'lucide-react';
import RotatingBrandGrid from '@/components/home/RotatingBrandGrid';

interface HeroSectionProps {
  totalTools: number;
  totalCategories: number;
}

const HERO_FEATURED_CATEGORIES = [
  {
    title: 'Coding Assistants',
    badge: '+ Popular',
    icon: Terminal,
    color: '#8b5cf6',
    count: '340+ tools',
    tools: ['Cursor', 'Copilot', 'v0', 'Claude'],
  },
  {
    title: 'Autonomous Agents',
    badge: '+ Trending',
    icon: Bot,
    color: '#0891b2',
    count: '210+ tools',
    tools: ['Devin', 'CrewAI', 'AutoGPT', 'Manus'],
  },
  {
    title: 'Creative Generators',
    badge: '+ Hot',
    icon: ImageIcon,
    color: '#10b981',
    count: '480+ tools',
    tools: ['Midjourney', 'Runway', 'Flux', 'Sora'],
  },
  {
    title: 'Frontier Models',
    badge: '+ Core',
    icon: Cpu,
    color: '#f59e0b',
    count: '150+ models',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Llama'],
  },
];

export default function HeroSection({ totalTools, totalCategories }: HeroSectionProps) {
  return (
    <section className="cal-hero-wrapper">
      <style>{`
        /* ── Cal.com Inspired Bounded Hero Card Container ── */
        .cal-hero-wrapper {
          position: relative;
          width: 100%;
          padding: 1.25rem 0 2rem;
        }

        .cal-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3.5rem 2rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .cal-hero-card {
          background: linear-gradient(135deg, #130f24 0%, #1a1432 50%, #140f26 100%);
          border: 1px solid rgba(139, 92, 246, 0.25);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        @media (max-width: 640px) {
          .cal-hero-card { padding: 2.5rem 1.25rem 2rem; }
        }

        /* Ambient Glow Mesh Background (Dark Mode only) */
        .cal-hero-bg-glow {
          display: none;
        }
        [data-theme='dark'] .cal-hero-bg-glow {
          display: block;
          position: absolute;
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          width: 1100px;
          height: 600px;
          background: 
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(167, 139, 250, 0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
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
          margin: 1.5rem 0 0 0;
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
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 1px 8px;
          border-radius: 99px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          font-size: 0.68rem;
          font-weight: 500;
          color: #18181b;
          letter-spacing: -0.01em;
          line-height: 1.3;
          text-transform: none;
        }
        [data-theme='dark'] .cal-tag-pill {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          color: #ededed;
        }
      `}</style>

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        <div className="cal-hero-card">
          <div className="cal-hero-bg-glow" />

          {/* Main Hero Header */}
        <div className="cal-hero-content">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="cal-hero-badge"
          >
            <span className="cal-badge-pulse" />
            <span>The Curated AI Directory</span>
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

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="cal-cta-group banner-cta-group center"
          >
            <Link
              href="/tools"
              className="btn-primary banner-cta-btn"
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                minWidth: '155px',
              }}
            >
              Explore directory <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
            </Link>
            <Link
              href="/submit"
              className="btn-secondary banner-cta-btn"
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                minWidth: '155px',
              }}
            >
              Submit AI tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
            </Link>
          </motion.div>
        </div>

        {/* Superhuman Live Rotating Brand Matrix Bar */}
        <div style={{ marginTop: '1.25rem', marginBottom: '1.75rem' }}>
          <RotatingBrandGrid />
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
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span className="brand-text">toolstaq.com</span> / intelligence-index
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
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '5px', overflow: 'hidden' }}>
                      {cat.tools.map((t) => (
                        <span key={t} style={{
                          fontSize: '0.68rem', fontWeight: 500, padding: '2px 6px', borderRadius: '5px',
                          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)', whiteSpace: 'nowrap',
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
      </div>
    </section>
  );
}
