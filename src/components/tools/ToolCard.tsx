import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { getPricingLabel } from '@/lib/tools';
import ToolLogo from '@/components/tools/ToolLogo';

function getPricingClass(model: string, freeTrial: boolean): string {
  if (freeTrial && model === 'freemium') return 'badge pricing-free';
  if (freeTrial) return 'badge pricing-freemium';
  const map: Record<string, string> = {
    freemium: 'badge pricing-freemium',
    subscription: 'badge pricing-subscription',
    'usage-based': 'badge pricing-usage',
    'one-time': 'badge pricing-onetime',
    'custom pricing': 'badge pricing-custom',
  };
  return map[model] || 'badge pricing-subscription';
}

interface ToolCardProps {
  tool: Tool;
  hideRecommendedBadge?: boolean;
}

export default function ToolCard({ tool, hideRecommendedBadge = false }: ToolCardProps) {
  const pricingLabel = getPricingLabel(tool);
  const pricingClass = getPricingClass(tool.pricing_model, tool.free_trial);

  return (
    <Link href={`/tools/${tool.slug}`} scroll={true} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div className="tool-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '1.25rem' }}>

        {/* Top: Logo + Name & Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flexShrink: 0 }}>
            <ToolLogo
              url={tool.url}
              icon={tool.icon}
              favicon_url={tool.favicon_url}
              size={42}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
              <h3 style={{
                fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                margin: 0, lineHeight: 1.2,
                maxWidth: '100%',
              }}>
                {tool.tool_name}
              </h3>
              {tool.is_recommended && !hideRecommendedBadge && (
                <span className="monochrome-pill-badge-sm">
                  Recommended
                </span>
              )}
              {tool.is_new && (
                <span className="monochrome-pill-badge-sm">
                  New
                </span>
              )}
            </div>
            {tool.title && (
              <p style={{
                fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden', margin: 0,
              }}>
                {tool.title}
              </p>
            )}
          </div>
        </div>

        {/* Bottom: Pricing, Category */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className="monochrome-pill-badge-sm">
              {pricingLabel}
            </span>
            <span className="monochrome-pill-badge-sm">
              {tool.primary_category}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
