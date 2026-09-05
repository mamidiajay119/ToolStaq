'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1400px',
        padding: '0 1.5rem',
        zIndex: 100,
        transition: 'all 200ms ease',
      }}
    >
      {/* Full-Width Floating Rounded Square Bar */}
      <div
        className="floating-header-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          padding: '0 24px',
          borderRadius: '16px',
          background: scrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--header-border)',
          boxShadow: scrolled ? 'var(--header-shadow-scrolled)' : 'var(--header-shadow)',
          transition: 'all 200ms ease',
          position: 'relative',
        }}
      >
        {/* Left: Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="toolstaq logo"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              objectFit: 'contain',
            }}
          />
          <span className="brand-text" style={{ fontSize: '1.2rem' }}>
            toolstaq
          </span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="center-nav hidden-mobile">
          <Link href="/tools" className="btn-ghost" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>Tools</Link>
          <Link href="/categories" className="btn-ghost" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>Categories</Link>
          <Link href="/providers" className="btn-ghost" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>Providers</Link>
          <Link href="/news" className="btn-ghost" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>AI News</Link>
          <Link href="/compare" className="btn-ghost" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>Compare</Link>
          <Link href="/submit" className="btn-ghost" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>Submit Tool</Link>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
          <ThemeToggle />
          <Link href="/newsletter" className="btn-primary" style={{ padding: '6px 18px', borderRadius: '10px', fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Subscribe <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="show-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-ghost"
            style={{ padding: '8px', borderRadius: '10px' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          marginTop: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(16px)',
        }}>
          <Link href="/tools" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>Tools</Link>
          <Link href="/categories" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>Categories</Link>
          <Link href="/providers" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>Providers</Link>
          <Link href="/news" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>AI News</Link>
          <Link href="/compare" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>Compare</Link>
          <Link href="/submit" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>Submit Tool</Link>
          <Link href="/newsletter" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center', marginTop: '6px', gap: '4px', borderRadius: '99px' }}>
            Subscribe <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      )}

      <style>{`
        :root {
          --header-bg: rgba(255, 255, 255, 0.75);
          --header-bg-scrolled: rgba(255, 255, 255, 0.92);
          --header-border: rgba(139, 92, 246, 0.18);
          --header-shadow: 0 4px 20px rgba(139, 92, 246, 0.08);
          --header-shadow-scrolled: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        [data-theme='dark'] {
          --header-bg: rgba(19, 15, 36, 0.75);
          --header-bg-scrolled: rgba(11, 8, 22, 0.92);
          --header-border: rgba(139, 92, 246, 0.2);
          --header-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          --header-shadow-scrolled: 0 12px 40px rgba(0, 0, 0, 0.7);
        }
        .center-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        @media (max-width: 900px) {
          .center-nav {
            position: static;
            transform: none;
            flex: 1;
            justify-content: center;
          }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
