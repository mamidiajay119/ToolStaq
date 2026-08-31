'use client';

import { useState, useMemo } from 'react';

interface ToolLogoProps {
  url: string;
  icon: string;             // emoji fallback
  favicon_url?: string;     // pre-scraped URL from data pipeline
  size?: number;
  borderRadius?: number;
}

function getFaviconSources(url: string, favicon_url?: string): string[] {
  const sources: string[] = [];
  if (favicon_url) {
    sources.push(favicon_url);
  }
  try {
    const { hostname } = new URL(url);
    const domain = hostname.replace(/^www\./, '');
    if (domain) {
      // 1. High-quality favicon.im CDN
      sources.push(`https://a.favicon.im/${domain}?larger=true&throw-error-on-404=true`);
      // 2. Google Favicon Service
      sources.push(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`);
    }
  } catch {
    // Ignore URL parse errors
  }
  return sources;
}

export default function ToolLogo({
  url,
  icon,
  favicon_url,
  size = 42,
  borderRadius = size >= 64 ? 16 : 10,
}: ToolLogoProps) {
  const sources = useMemo(() => getFaviconSources(url, favicon_url), [url, favicon_url]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = sources[sourceIndex];

  const handleError = () => {
    if (sourceIndex + 1 < sources.length) {
      setSourceIndex(sourceIndex + 1);
    } else {
      setFailed(true);
    }
  };

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${borderRadius}px`,
    flexShrink: 0,
    background: loaded ? '#ffffff' : 'var(--bg-secondary)',
    border: loaded ? 'var(--border-width, 1px) solid rgba(0, 0, 0, 0.08)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  const emojiStyle: React.CSSProperties = {
    fontSize: size >= 64 ? '2rem' : '1.3rem',
    lineHeight: 1,
  };

  if (failed || !src) {
    return (
      <div style={containerStyle}>
        <span style={emojiStyle}>{icon}</span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Emoji shown while image loads */}
      {!loaded && (
        <span
          style={{
            ...emojiStyle,
            position: 'absolute',
            opacity: 0.4,
          }}
        >
          {icon}
        </span>
      )}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{
          width: size >= 64 ? `${size - 12}px` : `${size - 8}px`,
          height: size >= 64 ? `${size - 12}px` : `${size - 8}px`,
          objectFit: 'contain',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.25s ease',
          borderRadius: size >= 64 ? '6px' : '4px',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  );
}
