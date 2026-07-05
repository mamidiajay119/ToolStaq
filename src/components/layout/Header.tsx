'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Zap, GitCompare, PlusCircle, Mail } from 'lucide-react';
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
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 200ms ease',
        background: scrolled ? 'var(--bg-overlay)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      }}
    >
      <div className="container-xl" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '1.5rem' }}>
        
        {/* Left: Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em' }}>
            AI<span style={{ color: 'var(--accent-primary)' }}>Tools</span>
          </span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="center-nav hidden-mobile">
          <Link href="/tools" className="btn-ghost">Tools</Link>
          <Link href="/categories" className="btn-ghost">Categories</Link>
          <Link href="/compare" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <GitCompare size={14} /> Compare
          </Link>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
          <ThemeToggle />
          <Link href="/#subscribe" className="btn-secondary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
            <Mail size={14} style={{ marginRight: '4px' }} /> Subscribe
          </Link>
          <Link href="/submit" className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
            <PlusCircle size={14} /> Submit Tool
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="btn-ghost show-mobile"
          style={{ marginLeft: 'auto', padding: '8px' }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <Link href="/tools" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>Tools</Link>
          <Link href="/categories" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>Categories</Link>
          <Link href="/compare" className="btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>Compare Tools</Link>
          <Link href="/#subscribe" className="btn-secondary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start', marginTop: '8px' }}>Subscribe</Link>
          <Link href="/submit" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>Submit a Tool</Link>
        </div>
      )}

      <style>{`
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
