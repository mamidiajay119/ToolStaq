import type { Metadata } from 'next';
import { Mail, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import NewsletterForm from '@/components/news/NewsletterForm';

export const metadata: Metadata = {
  title: 'Subscribe to the ToolStaq Newsletter — Stay Ahead on AI',
  description: 'Join developers, builders, and creators who receive a curated weekly summary of the most important AI tools, model releases, and news stories.',
};

export default function NewsletterPage() {
  return (
    <>
      <style>{`
        .benefit-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
          padding: 1.25rem;
          border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-card);
          transition: transform 150ms ease, border-color 150ms ease;
        }
        .benefit-row:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-1px);
        }
        .benefit-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--accent-primary);
          flex-shrink: 0;
          border: 1px solid var(--border-subtle);
        }
        .newsletter-hero {
          position: relative;
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3rem;
        }
        .newsletter-hero::before {
          content: "";
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%);
          filter: blur(25px);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>

      <div className="container-lg" style={{ paddingTop: '4rem', paddingBottom: '7rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Hero Header */}
          <div className="newsletter-hero">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '99px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
            }}>
              <Sparkles size={12} color="var(--accent-primary)" />
              <span>THE WEEKLY BRIEFING</span>
            </div>
            
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}>
              Stay ahead on AI without the{' '}
              <span className="gradient-text-orange" style={{ fontWeight: 700 }}>noise</span>
            </h1>
            
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: '0 auto',
              maxWidth: '520px',
            }}>
              Get a weekly curated briefing of the most important AI tools, releases, and news sent straight to your inbox.
            </p>
          </div>

          {/* Core Sign-Up Form Box */}
          <div className="glass-card" style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Join the ToolStaq Newsletter
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: '-0.75rem' }}>
              Delivered every Sunday. Safe, free, and unsubscribable in 1 click.
            </p>
            
            <NewsletterForm />
          </div>

          {/* Value Propositions / Benefits list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '1rem' }}>
            {[
              {
                icon: <Zap size={18} />,
                title: 'Weekly AI Recap',
                desc: 'A curated, 5-minute summary of the major model launches, benchmarks, and regulation news from the past 7 days.'
              },
              {
                icon: <Sparkles size={18} />,
                title: 'Curated Tool Spotlights',
                desc: 'Discover high-signal, fully verified AI coding, writing, and automation tools handpicked from the ToolStaq directory.'
              },
              {
                icon: <ShieldCheck size={18} />,
                title: 'Privacy Guaranteed',
                desc: 'Your email address is strictly encrypted and never shared. No spam, no advertisements, unsubscribe whenever you like.'
              }
            ].map((benefit, i) => (
              <div key={i} className="benefit-row">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
