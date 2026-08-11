'use client';

import Link from 'next/link';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { getAllCategories, slugifyCategory } from '@/lib/tools';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/subscribe';

export default function Footer() {
  const categories = getAllCategories().slice(0, 5);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('email', email);
      const result = await subscribeToNewsletter(null, formData);

      if (result.success) {
        setStatus({ type: 'success', message: result.message || 'Subscribed!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to subscribe.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer style={{
      borderTop: 'none',
      background: 'var(--bg-primary)',
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
              <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 400, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
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

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Stay Updated
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Get the latest AI tools delivered to your inbox weekly.
            </p>
            {status && status.type === 'success' ? (
              <div style={{
                padding: '1.25rem 1rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)' }} />
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Subscribed!
                </h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {status.message}
                </p>
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleSubscribe}
                  style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
                >
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="search-input"
                    style={{ padding: '9px 14px', fontSize: '0.875rem', outline: 'none' }}
                    id="newsletter-email"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary" 
                    style={{ 
                      justifyContent: 'center', 
                      padding: '9px 14px',
                      opacity: isLoading ? 0.8 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {isLoading ? (
                      <>
                        Subscribing <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
                {status && status.type === 'error' && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--accent-rose)', 
                    marginTop: '8px',
                    lineHeight: 1.4,
                  }}>
                    {status.message}
                  </p>
                )}
              </>
            )}
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
