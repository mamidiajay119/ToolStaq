'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  X, ChevronRight, Sparkles, Scale, ArrowLeftRight, Check, Minus, 
  ExternalLink, DollarSign, Layers, Users, Cpu, ShieldCheck, Zap, RotateCw
} from 'lucide-react';
import type { Tool } from '@/types/tool';
import { getPricingLabel, getToolDescription } from '@/lib/tools';
import { getRotatedCategoryComparisons } from '@/lib/comparison-pairs';
import ToolLogo from '@/components/tools/ToolLogo';

interface CompareClientProps {
  tools: Tool[];
  initialSlugs?: string[];
}

interface SectionRow {
  label: string;
  key: string;
  render?: (tool: Tool) => React.ReactNode;
}

interface TableSection {
  sectionTitle: string;
  icon: React.ReactNode;
  rows: SectionRow[];
}

function BooleanBadge({ value, trueText = 'Yes', falseText = 'No' }: { value: boolean; trueText?: string; falseText?: string }) {
  return (
    <span style={{ fontSize: '0.83rem', fontWeight: 600, color: value ? '#10B981' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <ChevronRight size={14} strokeWidth={2.5} style={{ color: value ? '#10B981' : 'var(--text-muted)', flexShrink: 0 }} />
      {value ? trueText : falseText}
    </span>
  );
}

function ArrowList({ items, variant = 'default' }: { items: string[]; variant?: 'default' | 'success' | 'danger' }) {
  if (!items || items.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>—</span>;
  }

  const arrowColor = variant === 'success' ? '#10B981' : variant === 'danger' ? '#EF4444' : 'var(--accent-primary)';

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          <ChevronRight size={14} strokeWidth={2.5} style={{ color: arrowColor, flexShrink: 0, marginTop: '3px' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FormattedRichText({ text, variant = 'default' }: { text?: string | null; variant?: 'default' | 'success' | 'danger' }) {
  if (!text) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>—</span>;
  }

  const lines = text
    .split(/\n|(?=•)/)
    .map((l) => l.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>—</span>;
  }

  return <ArrowList items={lines} variant={variant} />;
}

export default function CompareClient({ tools, initialSlugs }: CompareClientProps) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);

  // Automatically generated 8 same-category comparison cards (1 per top category)
  const rotatedCategoryCards = useMemo(() => {
    return getRotatedCategoryComparisons(tools, rotationOffset);
  }, [tools, rotationOffset]);

  // Initialize comparison tools (max 2 tools)
  useEffect(() => {
    if (initialSlugs && initialSlugs.length > 0) {
      setSelected(initialSlugs.slice(0, 2));
      return;
    }

    const queryTool = searchParams.get('tool');
    if (queryTool && tools.some((t) => t.slug === queryTool)) {
      // Find a default counterpart tool in the same category or popular pair
      const match = tools.find((t) => t.slug === queryTool);
      const counterpart = tools.find(
        (t) => t.slug !== queryTool && t.primary_category === match?.primary_category
      ) || tools.find((t) => t.slug !== queryTool);

      if (counterpart) {
        setSelected([queryTool, counterpart.slug]);
      } else {
        setSelected([queryTool]);
      }
    } else if (tools.length >= 2) {
      // Default pair: ChatGPT vs Claude or first two tools
      const chatgpt = tools.find((t) => t.slug === 'chatgpt');
      const claude = tools.find((t) => t.slug === 'claude');
      if (chatgpt && claude) {
        setSelected(['chatgpt', 'claude']);
      } else {
        setSelected([tools[0].slug, tools[1].slug]);
      }
    }
  }, [initialSlugs, searchParams, tools]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return tools
      .filter(
        (t) =>
          !selected.includes(t.slug) &&
          (t.tool_name.toLowerCase().includes(q) ||
            t.primary_category.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [tools, search, selected]);

  const selectedTools = selected.map((s) => tools.find((t) => t.slug === s)!).filter(Boolean);

  const addTool = (slug: string) => {
    if (selected.length >= 2) {
      // Replace second tool if already 2 selected
      setSelected([selected[0], slug]);
    } else {
      setSelected((prev) => [...prev, slug]);
    }
    setSearch('');
    setFocused(false);
  };

  const removeTool = (slug: string) => setSelected(selected.filter((s) => s !== slug));

  const selectPair = (slug1: string, slug2: string) => {
    setSelected([slug1, slug2]);
    const selectorEl = document.getElementById('compare-table-box');
    if (selectorEl) selectorEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Structured comparison table definition displaying strictly fields from individual tool pages
  const TABLE_SECTIONS: TableSection[] = [
    {
      sectionTitle: 'General Overview & Verdict',
      icon: <Layers size={18} style={{ color: 'var(--accent-primary)' }} />,
      rows: [
        {
          label: 'Subtitle & Tagline',
          key: 'title',
          render: (t) => t.title || '—',
        },
        {
          label: 'Categories',
          key: 'primary_category',
          render: (t) => (
            <ArrowList items={Array.from(new Set([t.primary_category, ...(t.category || [])])).filter(Boolean)} />
          ),
        },
        {
          label: 'Overview',
          key: 'description',
          render: (t) => (
            <p style={{ margin: 0, lineHeight: 1.5, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              {getToolDescription(t)}
            </p>
          ),
        },
        {
          label: 'Badges & Status',
          key: 'is_recommended',
          render: (t) => {
            const statuses = [
              t.is_recommended ? 'Recommended Tool' : null,
              t.is_new ? 'New Addition' : null,
              t.open_source ? 'Open Source Project' : null,
            ].filter(Boolean) as string[];

            return statuses.length > 0 ? (
              <ArrowList items={statuses} />
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Standard Tool</span>
            );
          },
        },
      ],
    },
    {
      sectionTitle: 'Pricing & Value',
      icon: <DollarSign size={18} style={{ color: '#10B981' }} />,
      rows: [
        {
          label: 'Starting Cost',
          key: 'starting_price_usd',
          render: (t) => (
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
              {getPricingLabel(t)}
            </span>
          ),
        },
        {
          label: 'Pricing Details',
          key: 'pricing_details',
          render: (t) => <FormattedRichText text={t.pricing_details} />,
        },
        {
          label: 'Time to Value',
          key: 'time_to_value',
          render: (t) => t.time_to_value || '—',
        },
      ],
    },
    {
      sectionTitle: 'Features & Capabilities',
      icon: <Zap size={18} style={{ color: '#F59E0B' }} />,
      rows: [
        {
          label: 'Core Features & Capabilities',
          key: 'core_features_rich',
          render: (t) =>
            t.core_features_rich ? (
              <FormattedRichText text={t.core_features_rich} />
            ) : (
              <ArrowList items={t.core_features} />
            ),
        },
        {
          label: 'Integrations & Ecosystem',
          key: 'integrations',
          render: (t) => <ArrowList items={t.integrations} />,
        },
        {
          label: 'API Availability',
          key: 'has_api',
          render: (t) => <BooleanBadge value={t.has_api} trueText="API Available" falseText="No Public API" />,
        },
        {
          label: 'Open Source',
          key: 'open_source',
          render: (t) => <BooleanBadge value={t.open_source} trueText="Open Source" falseText="Proprietary" />,
        },
        {
          label: 'Architecture & Security',
          key: 'technical_architecture',
          render: (t) => <FormattedRichText text={t.technical_architecture} />,
        },
      ],
    },
    {
      sectionTitle: 'Target Audience & Suitability',
      icon: <Users size={18} style={{ color: '#8B5CF6' }} />,
      rows: [
        {
          label: 'Best For',
          key: 'best_for',
          render: (t) => <ArrowList items={t.best_for} variant="success" />,
        },
        {
          label: 'User Personas',
          key: 'target_user_persona',
          render: (t) => <ArrowList items={t.target_user_persona} />,
        },
        {
          label: 'Focus Area',
          key: 'focus_area',
          render: (t) => <FormattedRichText text={t.focus_area} />,
        },
      ],
    },
    {
      sectionTitle: 'Technical Specs & Alternatives',
      icon: <Cpu size={18} style={{ color: '#3B82F6' }} />,
      rows: [
        {
          label: 'Complexity Level',
          key: 'complexity_level',
          render: (t) => (
            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {t.complexity_level || '—'}
            </span>
          ),
        },
        {
          label: 'Deployment Platform',
          key: 'deployment',
          render: (t) => t.deployment || '—',
        },
        {
          label: 'Top Alternatives',
          key: 'alternatives',
          render: (t) => <ArrowList items={t.alternatives} />,
        },
      ],
    },
  ];

  return (
    <>
      <style>{`
        .compare-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .compare-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .compare-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .compare-hero-grid { grid-template-columns: 1.15fr 0.85fr; }
        }

        .compare-pill-badge {
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
        [data-theme='dark'] .compare-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .compare-hero-heading {
          font-size: 2.3rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 0.85rem 0;
        }

        .compare-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 500px;
        }

        .programmatic-compare-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.25rem;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }
        .programmatic-compare-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.12);
        }
        .compare-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) {
          .compare-cards-grid {
            grid-template-columns: 1fr;
          }
        }
        .compare-cta-group {
          display: flex;
          gap: 12px;
          align-items: center;
          max-width: 380px;
        }
        .compare-cta-btn {
          flex: 1;
          min-width: 150px;
          height: 40px;
          padding: 0 16px;
          border-radius: 10px;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-sizing: border-box;
          white-space: nowrap;
        }
        @media (max-width: 580px) {
          .compare-cta-group {
            flex-direction: column;
            width: 100%;
            max-width: 100%;
          }
          .compare-cta-btn {
            width: 100%;
            flex: none;
          }
        }

        .compare-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }

        .compare-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 680px;
        }

        @media (min-width: 768px) {
          .compare-table {
            min-width: 100%;
          }
        }

        @media (max-width: 767px) {
          .sticky-col-header,
          .sticky-col-cell {
            position: sticky;
            left: 0;
            z-index: 10;
            background: var(--bg-card) !important;
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
          }
          [data-theme='dark'] .sticky-col-header,
          [data-theme='dark'] .sticky-col-cell {
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
        {/* Animated Compare Hero Card Banner */}
        <div className="compare-hero-card">
          <div className="compare-hero-grid">
            {/* Left Column: Badge, Headline, Subtitle, CTAs */}
            <div>
              <div className="compare-pill-badge">
                <span>+ 2-Tool Side-by-Side Comparison</span>
              </div>

              <h1 className="compare-hero-heading">
                Compare 2 AI tools<br />
                head-to-head
              </h1>

              <p className="compare-hero-sub">
                Evaluate every single spec, feature, integration, pricing tier, and verdict side-by-side to choose the perfect software for your stack.
              </p>

              {/* Action CTAs */}
              <div className="compare-cta-group">
                <button
                  onClick={() => {
                    const selectorEl = document.getElementById('compare-table-box');
                    if (selectorEl) selectorEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary compare-cta-btn"
                  style={{ fontWeight: 600 }}
                >
                  View comparison <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
                </button>
                <Link
                  href="/tools"
                  className="btn-secondary compare-cta-btn"
                  style={{ fontWeight: 500, textDecoration: 'none' }}
                >
                  Browse tools <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
                </Link>
              </div>
            </div>

            {/* Right Column: VS Preview */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedTools.length === 2 ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '380px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Tool 1 Card */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', left: '10px', width: '160px', height: '115px',
                      borderRadius: '16px', background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                      padding: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                  >
                    <ToolLogo url={selectedTools[0].url} icon={selectedTools[0].icon} favicon_url={selectedTools[0].favicon_url} size={36} borderRadius={10} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {selectedTools[0].tool_name}
                    </span>
                  </motion.div>

                  {/* VS Badge */}
                  <div style={{
                    position: 'absolute', zIndex: 5,
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--accent-primary)', color: '#FFFFFF',
                    fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                    border: '3px solid var(--bg-card)',
                  }}>
                    VS
                  </div>

                  {/* Tool 2 Card */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    style={{
                      position: 'absolute', right: '10px', width: '160px', height: '115px',
                      borderRadius: '16px', background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                      padding: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                  >
                    <ToolLogo url={selectedTools[1].url} icon={selectedTools[1].icon} favicon_url={selectedTools[1].favicon_url} size={36} borderRadius={10} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {selectedTools[1].tool_name}
                    </span>
                  </motion.div>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Select 2 tools below to compare
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 8 Rotated Same-Category Comparison Cards Below Banner ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.15rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Popular AI Tool Comparisons
            </h2>
          </div>

          <div className="compare-cards-grid">
            {rotatedCategoryCards.map((item) => (
              <div
                key={item.slug}
                className="tool-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '1.25rem',
                }}
                onClick={() => selectPair(item.t1.slug, item.t2.slug)}
              >
                {/* Top Section: Tool 1 vs Tool 2 Header with Logos & Names */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  {/* Tool 1 Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <ToolLogo
                      url={item.t1.url}
                      icon={item.t1.icon}
                      favicon_url={item.t1.favicon_url}
                      size={38}
                      borderRadius={10}
                    />
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                      }}>
                        {item.t1.tool_name}
                      </h4>
                    </div>
                  </div>

                  {/* Center VS Badge */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}>
                    VS
                  </div>

                  {/* Tool 2 Info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', minWidth: 0, flex: 1, textAlign: 'right' }}>
                    <div style={{ minWidth: 0, textAlign: 'right' }}>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                        maxWidth: '100%',
                      }}>
                        {item.t2.tool_name}
                      </h4>
                    </div>
                    <ToolLogo
                      url={item.t2.url}
                      icon={item.t2.icon}
                      favicon_url={item.t2.favicon_url}
                      size={38}
                      borderRadius={10}
                    />
                  </div>
                </div>

                {/* Bottom Footer: Category Badge & Compare Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: 'auto',
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {item.categoryName}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Compare <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Comparison Controls & Side-by-Side Detail Table ── */}
        <div id="compare-table-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Selector Bar for 2 Tools */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Selected Tools ({selectedTools.length}/2)
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Comparing 2 tools side-by-side with complete details.
                </p>
              </div>

              {/* Tool Search / Add Input */}
              {selectedTools.length < 2 && (
                <div style={{ position: 'relative', width: '280px' }}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    placeholder="Search tool to compare…"
                    className="search-input"
                    style={{ fontSize: '0.85rem', padding: '8px 12px', width: '100%', boxSizing: 'border-box' }}
                  />
                  {focused && searchResults.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                    >
                      {searchResults.map((tool, i) => (
                        <button
                          key={tool.slug}
                          onMouseDown={() => addTool(tool.slug)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '9px 12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderBottom: i < searchResults.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                            textAlign: 'left',
                            transition: 'background 120ms',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                            {tool.tool_name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                            {tool.primary_category}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Tool Tags */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[0, 1].map((index) => {
                const tool = selectedTools[index];
                return (
                  <div
                    key={index}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: '64px',
                    }}
                  >
                    {tool ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ToolLogo url={tool.url} icon={tool.icon} favicon_url={tool.favicon_url} size={38} borderRadius={10} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                              {tool.tool_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {tool.primary_category}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeTool(tool.slug)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '4px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Remove tool"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          + Add 2nd Tool to Compare
                        </span>
                        {selectedTools.length === 1 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                            Use search above
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Side-by-Side Detailed Comparison Table ── */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            }}
          >
            {selectedTools.length < 2 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.95rem' }}>
                  {selectedTools.length === 0
                    ? 'Search and select 2 tools to start comparing.'
                    : 'Add 1 more tool to generate the side-by-side comparison table.'}
                </p>
              </div>
            ) : (
              <div className="compare-table-wrapper">
                <table className="compare-table">
                  {/* Sticky Header with Tool Cards & CTAs */}
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                      <th
                        className="sticky-col-header"
                        style={{
                          width: '24%',
                          padding: '1.25rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Details & Specs
                      </th>
                      {selectedTools.map((tool) => (
                        <th
                          key={tool.slug}
                          style={{
                            width: '38%',
                            padding: '1.25rem 1.5rem',
                            textAlign: 'left',
                            borderLeft: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <ToolLogo url={tool.url} icon={tool.icon} favicon_url={tool.favicon_url} size={46} borderRadius={12} />
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {tool.tool_name}
                                </h3>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  {tool.primary_category}
                                </span>
                              </div>
                            </div>
                            <a
                              href={`/go/${tool.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                              style={{
                                padding: '7px 16px',
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                textDecoration: 'none',
                                justifyContent: 'center',
                                width: 'fit-content',
                              }}
                            >
                              Visit {tool.tool_name} <ChevronRight size={15} strokeWidth={2.5} />
                            </a>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {TABLE_SECTIONS.map((section, sIdx) => (
                      <React.Fragment key={sIdx}>
                        {/* Section Header Row */}
                        <tr style={{ background: 'var(--bg-secondary)', borderTop: '2px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                          <td
                            colSpan={3}
                            style={{
                              padding: '10px 1.5rem',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {section.icon}
                              <span>{section.sectionTitle}</span>
                            </div>
                          </td>
                        </tr>

                        {/* Section Data Rows */}
                        {section.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            style={{
                              borderBottom: '1px solid var(--border-subtle)',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <td
                              className="sticky-col-cell"
                              style={{
                                width: '24%',
                                padding: '1rem 1.5rem',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                fontWeight: 600,
                                verticalAlign: 'top',
                                background: 'var(--bg-card)',
                              }}
                            >
                              {row.label}
                            </td>
                            {selectedTools.map((tool) => (
                              <td
                                key={tool.slug}
                                style={{
                                  width: '38%',
                                  padding: '1rem 1.5rem',
                                  borderLeft: '1px solid var(--border-subtle)',
                                  fontSize: '0.85rem',
                                  color: 'var(--text-secondary)',
                                  verticalAlign: 'top',
                                }}
                              >
                                {row.render ? row.render(tool) : String((tool as any)[row.key] ?? '—')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                    {/* Final Bottom Visit CTA Row */}
                    <tr style={{ background: 'var(--bg-elevated)', borderTop: '2px solid var(--border-subtle)' }}>
                      <td className="sticky-col-cell" style={{ width: '24%', padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        Take Action
                      </td>
                      {selectedTools.map((tool) => (
                        <td key={tool.slug} style={{ padding: '1.25rem 1.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
                          <a
                            href={`/go/${tool.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                              padding: '9px 20px',
                              fontSize: '0.85rem',
                              borderRadius: '10px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                            }}
                          >
                            Visit {tool.tool_name} <ChevronRight size={15} strokeWidth={2.5} />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// Global React import for React.Fragment
import React from 'react';
