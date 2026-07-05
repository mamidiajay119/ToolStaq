'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { getMeta, getAllCategories, slugifyCategory } from '@/lib/tools';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function Footer() {
  const meta = getMeta();
  const categories = getAllCategories().slice(0, 12);

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-primary)',
      marginTop: '5rem',
    }}>
      <div className="container-xl" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={16} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
                AI<span style={{ color: 'var(--accent-primary)' }}>Tools</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '220px' }}>
              The most comprehensive directory of AI tools. Discover, compare, and find the perfect AI solution for your workflow.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.25rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', padding: '6px 12px',
              }}>
                <span style={{ fontSize: '1rem' }}>⚡</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9rem' }}>{meta.total.toLocaleString()}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>tools</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Navigate
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Browse All Tools', href: '/tools' },
                { label: 'Compare Tools', href: '/compare' },
                { label: 'Submit a Tool', href: '/submit' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  color: 'var(--text-muted)', fontSize: '0.875rem',
                  transition: 'color 150ms ease',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Top Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${slugifyCategory(cat)}`}
                  style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon category={cat} size={14} />
                  </span>
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Stay Updated
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Get the latest AI tools delivered to your inbox weekly.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="search-input"
                style={{ padding: '9px 14px', fontSize: '0.875rem' }}
                id="newsletter-email"
              />
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '9px 14px' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
            © 2025 AITools Directory. Built to help you find the right AI.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Twitter / X
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
