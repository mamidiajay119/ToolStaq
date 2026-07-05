'use client';

import { useState } from 'react';
import { urlToFaviconSrc } from '@/lib/favicon';

interface ToolLogoProps {
  url: string;
  icon: string;             // emoji fallback
  favicon_url?: string;     // pre-scraped URL from data pipeline
  size?: 42 | 64 | 80;
  borderRadius?: number;
}

export default function ToolLogo({
  url,
  icon,
  favicon_url,
  size = 42,
  borderRadius = size >= 64 ? 16 : 10,
}: ToolLogoProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Use pre-scraped URL first, then Google favicon service as fallback
  const src = favicon_url || urlToFaviconSrc(url);

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${borderRadius}px`,
    flexShrink: 0,
    background: 'var(--bg-secondary)',
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
        onError={() => setFailed(true)}
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
