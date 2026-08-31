'use client';

import Link from 'next/link';

interface MarqueeTool {
  slug: string;
  tool_name: string;
  url: string;
  favicon_url: string | null;
  primary_category: string;
}

interface HomeMarqueeProps {
  tools: MarqueeTool[];
}

export default function HomeMarquee({ tools }: HomeMarqueeProps) {
  if (tools.length === 0) return null;

  const items = tools.length < 8
    ? [...tools, ...tools, ...tools, ...tools]
    : [...tools, ...tools];

  return (
    <div style={{
      borderTop: 'var(--border-width, 1px) solid var(--border-subtle)',
      borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)',
      padding: '1.25rem 0',
      background: 'var(--bg-primary)',
      width: '100%',
    }}>
      <style>{`
        .home-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: homeMarquee 35s linear infinite;
        }
        .home-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes homeMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .home-marquee-capsule {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-secondary);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 14px;
          padding: 9px 16px;
          text-decoration: none;
          min-width: 210px;
          max-width: 240px;
          flex-shrink: 0;
          transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
          box-shadow: var(--shadow-card);
        }
        [data-theme='dark'] .home-marquee-capsule {
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .home-marquee-capsule:hover {
          border-color: var(--accent-primary) !important;
          box-shadow: var(--shadow-hover) !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* container-xl: matches the header's max-width: 1400px + padding */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '8px 1.5rem',
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
      }}>
        <div className="home-marquee-track">
          {items.map((tool, idx) => {
            let faviconSrc = tool.favicon_url;
            if (!faviconSrc) {
              try {
                faviconSrc = `https://www.google.com/s2/favicons?domain=${new URL(tool.url).hostname}&sz=64`;
              } catch {
                faviconSrc = '';
              }
            }
            return (
              <Link
                key={`${tool.slug}-${idx}`}
                href={`/tools/${tool.slug}`}
                className="home-marquee-capsule"
              >
                {faviconSrc && (
                  <img
                    src={faviconSrc}
                    alt={tool.tool_name}
                    width={34}
                    height={34}
                    style={{ borderRadius: '9px', flexShrink: 0, background: '#fff', objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {tool.tool_name}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', color: 'var(--text-muted)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {tool.primary_category.replace('AI ', '')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
