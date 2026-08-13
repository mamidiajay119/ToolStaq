'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { getAllCategories, slugifyCategory } from '@/lib/tools';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function Footer() {
  const categories = getAllCategories().slice(0, 5);

  return (
    <footer className="site-footer" style={{
      borderTop: 'none',
      marginTop: '3.5rem',
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
              <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 400, fontSize: '1.15rem', letterSpacing: '-0.035em', color: 'var(--text-primary)' }}>
                toolstaq
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', lineHeight: 1.6, maxWidth: '240px' }}>
              Discover, compare, and integrate the best AI tools for your development and business workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Navigate
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Tools', href: '/tools' },
                { label: 'Categories', href: '/categories' },
                { label: 'Compare', href: '/compare' },
                { label: 'News', href: '/news' },
                { label: 'Submit Tool', href: '/submit' },
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
              Popular
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

          {/* Legal & Support */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Legal &amp; Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
                { label: 'Contact Us', href: '/contact' },
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
        </div>

        <div style={{
          borderTop: 'none',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', textAlign: 'center' }}>
            © 2026 ToolStaq. Built to help you find the right AI Tool.
          </p>

        </div>
      </div>
    </footer>
  );
}
