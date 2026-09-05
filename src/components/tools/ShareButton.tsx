'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';
import { getAbsoluteUrl } from '@/lib/siteConfig';

interface ShareButtonProps {
  toolName: string;
  toolTitle?: string;
  toolSlug: string;
}

export default function ShareButton({ toolName, toolTitle, toolSlug }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : getAbsoluteUrl(`/tools/${toolSlug}`);

  const shareText = `Check out ${toolName}${toolTitle ? ` — ${toolTitle}` : ''} on toolstaq!`;

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    }
  };

  const handleMoreOptions = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${toolName} — toolstaq`,
          text: shareText,
          url: shareUrl,
        });
        setOpen(false);
        return;
      } catch (err) {
        // user cancelled or error
      }
    }
    // Fallback if navigator.share fails or isn't supported
    handleCopyLink();
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div ref={modalRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="share-trigger-btn"
        title="Share tool"
        aria-label="Share tool"
        style={{
          width: '38px',
          height: '38px',
          padding: 0,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.15s ease',
        }}
      >
        <Share2 size={16} />
      </button>

      {/* Share Popover Modal matching reference screenshot */}
      {open && (
        <div
          className="share-popover-card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            width: '220px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '6px',
            boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {/* Option 1: Copy link */}
          <button
            onClick={handleCopyLink}
            className="share-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
          >
            {copied ? (
              <>
                <Check size={18} style={{ color: '#10B981' }} />
                <span style={{ color: '#10B981', fontWeight: 600 }}>Link copied!</span>
              </>
            ) : (
              <>
                <Link2 size={18} style={{ color: 'var(--text-primary)' }} />
                <span>Copy link</span>
              </>
            )}
          </button>

          {/* Option 2: Share on X */}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="share-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'transparent',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'background 0.15s ease',
            }}
          >
            {/* X Logo SVG */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Share on X</span>
          </a>

          {/* Option 3: Share on LinkedIn */}
          <a
            href={linkedinShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="share-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'transparent',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'background 0.15s ease',
            }}
          >
            {/* LinkedIn Logo SVG */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>Share on LinkedIn</span>
          </a>

          {/* Option 4: More options... */}
          <button
            onClick={handleMoreOptions}
            className="share-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
          >
            <Share2 size={17} style={{ color: 'var(--text-primary)' }} />
            <span>More options...</span>
          </button>
        </div>
      )}

      {/* Hover styling for popover items & trigger button */}
      <style jsx global>{`
        .share-trigger-btn:hover {
          background: var(--bg-elevated) !important;
          border-color: var(--border-hover) !important;
        }
        .share-menu-item:hover {
          background: var(--bg-elevated) !important;
        }
        [data-theme='light'] .share-menu-item:hover {
          background: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}

